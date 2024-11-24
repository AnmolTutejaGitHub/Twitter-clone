import Meme from '../Assests/chill guy meme.avif';
function Notifications() {
    return (<div>
        <div className='text-[24px] text-center p-4 pt-10'>
            When You are a Chill Guy and Don't care to develop it
        </div>
        <div className='flex justify-center items-center'>
            <img src={Meme} className='w-[80%] rounded-md'></img>
        </div>
    </div>)
}
export default Notifications;