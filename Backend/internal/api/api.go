package api

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"sync"

	"github.com/gabrieldasneves/tazune_server/internal/store/pgstore"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx"
)


type apiHandler struct {
	q *pgstore.Queries
	r *chi.Mux
	upgrader websocket.Upgrader
	subscribers map[string]map[*websocket.Conn]context.CancelFunc
	mu *sync.Mutex
}

func (h apiHandler) ServeHTTP(w http.ResponseWriter,r *http.Request){
	h.r.ServeHTTP(w,r)
}

func NewHandler(q *pgstore.Queries) http.Handler{
a := apiHandler{
	q: q,
	upgrader: websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }},
	subscribers: make(map[string]map[*websocket.Conn]context.CancelFunc),
	mu: &sync.Mutex{},
}
r := chi.NewRouter()
r.Use(middleware.RequestID, middleware.Recoverer, middleware.Logger)

r.Use(cors.Handler(cors.Options{
    AllowedOrigins:   []string{"https://*", "http://*"},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
    AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
    ExposedHeaders:   []string{"Link"},
    AllowCredentials: false,
    MaxAge:           300, 
  }))

r.Get("/subscribe/{room_id}", a.handleSubscribe)


r.Route("/api", func(r chi.Router){
	r.Route("/rooms", func(r chi.Router){
		r.Post("/", a.handleCreatRoom)
		r.Get("/", a.handleGetRooms)
		r.Route("/{room_id}/messages", func(r chi.Router){
			r.Post("/", a.handlePostRoomMessages)
			r.Get("/", a.handleGetRoomMessages)
			r.Route("/{message_id}", func(r chi.Router){
				r.Get("/", a.handleGetRoomMessage)
				r.Patch("/react", a.handleReactToMessage)
				r.Delete("/react", a.handleRemoveReactFromMessage)
				r.Patch("/answer", a.handleMarkMessageAsAnswered)
			})
		})
	})
})


a.r = r
return a
}

func (h apiHandler) handleCreatRoom(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handleGetRooms(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handleGetRoomMessages(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handlePostRoomMessages(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handleGetRoomMessage(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handleReactToMessage(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handleRemoveReactFromMessage(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handleMarkMessageAsAnswered(w http.ResponseWriter, r *http.Request){}
func (h apiHandler) handleSubscribe(w http.ResponseWriter, r *http.Request){
	rawRoomID := chi.URLParam(r, "room_id")
	roomID, err := uuid.Parse(rawRoomID)
	if err != nil{
		http.Error(w, "invalid room id", http.StatusBadRequest)
		return
	}
	_, err = h.q.GetRoom(r.Context(), roomID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows){
			http.Error(w, "room not found", http.StatusBadRequest)
			return
		}
		http.Error(w, "something went wrong", http.StatusInternalServerError)
			return
	}

	c, err := h.upgrader.Upgrade(w,r,nil)
	if err != nil {
		slog.Warn("Failed to upgrade connection", "error",err)
		http.Error(w, "Failed to upgrade to websocket connection", http.StatusBadRequest)
		return
	}

	defer c.Close()

	ctx, cancel := context.WithCancel(r.Context())

	h.mu.Lock()
	if _, ok := h.subscribers[rawRoomID]; !ok {
		h.subscribers[rawRoomID] = make(map[*websocket.Conn]context.CancelFunc)
	}
	slog.Info("new client connected", "roon_id", rawRoomID, "client_ip", r.RemoteAddr)
	h.subscribers[rawRoomID][c] = cancel

	// if _, ok := h.subscribers[rawRoomID]; ok {
	// 	h.subscribers[rawRoomID][c] = cancel
	// }else{
	// 	h.subscribers[rawRoomID] = make(map[*websocket.Conn]context.CancelFunc)
	// 	h.subscribers[rawRoomID][c] = cancel
	// }

	h.mu.Unlock()

	<-ctx.Done()

	h.mu.Lock()
	delete(h.subscribers[rawRoomID], c)
	h.mu.Unlock()

}
