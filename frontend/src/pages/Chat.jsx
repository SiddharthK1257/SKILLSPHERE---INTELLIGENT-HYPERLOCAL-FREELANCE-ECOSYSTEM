import { useState } from "react";

import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] =
    useState(null);

  return (
    <div className="h-screen bg-gray-100">
      <div className="grid grid-cols-12 h-full">

        {/* Sidebar */}

        <div className="col-span-4 lg:col-span-3 border-r bg-white">

          <ChatSidebar
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />

        </div>

        {/* Chat Window */}

        <div className="col-span-8 lg:col-span-9">

          <ChatWindow
            conversation={selectedConversation}
          />

        </div>

      </div>
    </div>
  );
};

export default Chat;