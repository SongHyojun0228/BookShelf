import './Loading.css'

interface LoadingProps {
    text: string;
}

function Loading({ text }: LoadingProps) {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{text}를 불러오고 있어요..</p>
        </div>
    )
}

export default Loading;