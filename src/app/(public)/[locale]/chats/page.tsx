import ChatCard from "./chat-card";
import ChatComponent from "./chat-component";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10" style={{marginTop: '30px'}}>
      {/* Tăng chiều rộng container */}
      <div className="container mx-auto max-w-[100%] xl:max-w-[95%] 2xl:max-w-[85%]">
        <div className="rounded-[10px] bg-white shadow-lg dark:bg-gray-800">
          <div className="flex flex-wrap">
            {/* Sidebar - Chat List */}
            <div
              className="hidden xl:block bg-gray-50 dark:bg-gray-700 p-4 rounded-l-[10px]"
              style={{ width: "28%" }} // Tăng chiều rộng sidebar
            >
              <ChatCard />
            </div>

            {/* Main Chat Area */}
            <div
              className="w-full xl:w-[72%] p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900 rounded-r-[10px]"
              style={{ width: "72%" }} // Giảm chiều rộng khu vực chính tương ứng
            >
              <ChatComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
