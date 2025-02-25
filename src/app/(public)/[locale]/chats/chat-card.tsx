import Link from "next/link";
import Image from "next/image";

export type Chat = {
  active?: any;
  seen?: boolean;
  avatar: string;
  name: string;
  text: string;
  time: string;
  textCount: number;
  dot: number;
};

const chatData: Chat[] = [
  {
    active: true,
    avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    name: "Devid Heilo",
    text: "Hello, how are you?",
    time: "12 min",
    textCount: 3,
    dot: 3,
  },
  {
    active: true,
    avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    name: "Henry Fisher",
    text: "I am waiting for you",
    time: "5:54 PM",
    textCount: 0,
    dot: 1,
  },
  {
    active: null,
    avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    name: "Wilium Smith",
    text: "Where are you now?",
    time: "10:12 PM",
    textCount: 0,
    dot: 3,
  },
  {
    active: true,
    seen: true,
    avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    name: "Henry Deco",
    text: "Thank you so much!",
    time: "Sun",
    textCount: 2,
    dot: 6,
  },
  {
    active: false,
    avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    name: "Jubin Jack",
    text: "Hello, how are you?",
    time: "Oct 23",
    textCount: 0,
    dot: 3,
  },
];

const ChatCard = () => {
  return (
    <div className="col-span-12 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 xl:col-span-4">
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
        Chats
      </h4>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {chatData.map((chat, key) => (
          <Link
            href="/"
            className="flex items-center gap-4 py-4 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full overflow-hidden">
              <Image
                width={56}
                height={56}
                src={chat.avatar}
                alt="User"
                className="object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                  chat.active === true
                    ? "bg-green-500"
                    : chat.active === false
                    ? "bg-red-500"
                    : "bg-orange-400"
                }`}
              ></span>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="text-base font-medium text-gray-800 dark:text-gray-100">
                  {chat.name}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span
                    className={`${
                      chat.seen ? "dark:text-gray-500" : "font-semibold"
                    }`}
                  >
                    {chat.text}
                  </span>
                  <span className="ml-1 text-xs"> . {chat.time}</span>
                </p>
              </div>
              {chat.textCount !== 0 && (
                <div className="flex items-center justify-center rounded-full bg-blue-500 px-3 py-1">
                  <span className="text-xs font-medium text-white">
                    {chat.textCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
