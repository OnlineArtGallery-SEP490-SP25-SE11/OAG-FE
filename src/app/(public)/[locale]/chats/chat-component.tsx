"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function ChatComponent() {
    const [messages, setMessages] = useState([
        { id: 1, sender: "bot", text: "Hello! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() === "") return;

        const newMessage = { id: messages.length + 1, sender: "user", text: input };
        setMessages([...messages, newMessage]);
        setInput("");

        // Fake bot response after 1s
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: prev.length + 1, sender: "bot", text: "I received: " + input },
            ]);
        }, 1000);
    };

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto border rounded-lg p-4 shadow-lg bg-white dark:bg-gray-800">
           
            <div className="flex flex-1 items-center justify-between">
                <div>
                    <h5 className="font-medium text-dark dark:text-white">
                        Thuy Nguyen
                    </h5>
                </div>
            </div>



            <div className="flex-1 overflow-y-auto max-h-96 p-2 border-b">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`my-2 p-2 rounded-lg max-w-xs ${msg.sender === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-300 text-black"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="mt-3 flex">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
