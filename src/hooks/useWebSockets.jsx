import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws/websocket",
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe("/topic/stocks", (message) => {
                    console.log("Received message:", message.body);
                    setMessages((prev) => [...prev, message.body]);
                });
            },
            onStompError: (frame) => console.error("STOMPPPP ERROR !!!!:", frame),
        });

        client.activate();


        return () => {
            client.deactivate();
        };
    }, []);

    return messages;
};

export default useWebSocket;
