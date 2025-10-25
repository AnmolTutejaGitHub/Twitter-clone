import useUserStore from "../store/userStore";

function Message({ _key, timestamp, username_, msg }) {
    const { username,isAuthenticated,clearUser,userid } = useUserStore();
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parseMessage = (message) => {
        return message.split(urlRegex).map((part, index) => {
            if (urlRegex.test(part)) {
                return <a className="msg-url" key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
            }
            return part;
        });
    };
    return (
        <div className={`flex ${username_ == username ? `justify-end` : `justify-start`}`}>
            <div className="" key={_key}>
                <div className='flex flex-col'>
                    <div className={`${username_ == username ? `bg-[#1C9BEF]` : `bg-[#2F3336]`} p-2 inline-block overflow-hidden break-words rounded-lg text-center`}>
                        {parseMessage(msg)}
                    </div>
                    <div className="text-[#71767A] text-[12px]" >{timestamp}</div>
                </div>
            </div>
        </div>);
}

export default Message;

