import { useState } from 'react';
import { supabase } from '../../supabase';
import './Reviewmodal.css';

interface ReviewModalProps {
    onClose: () => void;
    book: any;
}

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

function Reviewmodal({ onClose, book }: ReviewModalProps) {

    const [stars, setStars] = useState(0);
    const [inputTextReview, setInputTextReview] = useState('');
    const [transcriptionInput, setTranscriptionInput] = useState('');
    const [transcriptionList, setTranscriptionList] = useState<string[]>([]);

    const handleAddReview = async () => {
        try {
            // 1. 리뷰 저장
            const { error: reviewError }
                = await supabase.from('Reviews')
                    .insert([{
                        user_id: UUID,
                        book_id: book.book_id,
                        description: inputTextReview,
                        star: stars
                    }])

            if (reviewError) throw reviewError;

            // 2. 필사 목록 저장 (있을 경우에만)
            if (transcriptionList.length > 0) {
                const transcriptionData = transcriptionList.map(item => ({
                    user_id: UUID,
                    book_id: book.book_id,
                    description: item
                }));

                const { error: transError } = await supabase
                    .from('Transcriptions')
                    .insert(transcriptionData);

                if (transError) throw transError;
            }

            console.log("리뷰 및 필사 저장 완료!!!!!")
            alert(`${book.title} 리뷰와 필사가 등록되었습니다.`)
            onClose();
        } catch (error) {
            console.log("리뷰 저장 중 오류 : ", error);
        }
    }

    const handleAddTranscription = () => {
        if (!transcriptionInput.trim()) return;
        setTranscriptionList([...transcriptionList, transcriptionInput]);
        setTranscriptionInput('');
    }

    const handleRemoveTranscription = (index: number) => {
        setTranscriptionList(transcriptionList.filter((_, i) => i !== index));
    }

    return (
        <div className='modal-backdrop'>
            <div className='review-modal-content'>
                <div className='modal-header'>
                    <h2><span className="header-icon">✍️</span> 리뷰 쓰기</h2>
                    <button className='close-btn' onClick={onClose}>✕</button>
                </div>

                <div className='modal-book-preview review-book-preview'>
                    <div className='preview-cover'>
                        <img src={book.img} alt={book.title} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className='preview-info'>
                        <h3 className='preview-title'>{book.title}</h3>
                        <p className='preview-author'>{book.author}</p>
                        <p className='preview-meta'>{book.pubDate} · {book.genre} · {book.publisher}</p>
                    </div>
                </div>

                <div className='review-section'>
                    <div className="review-label">
                        별점 <span className="required">*</span>
                    </div>
                    <div className="rating-container">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={
                                        `star-btn ${star <= stars ? 'active' : ''}`
                                    }
                                    onClick={() => setStars(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <span className="rating-score">{stars} / 5</span>
                    </div>
                </div>

                <div className='review-section'>
                    <div className="review-label">
                        리뷰 내용 <span className="required">*</span>
                    </div>
                    <div className="textarea-container">
                        <textarea
                            placeholder="이 책을 읽고 느낀 점을 자유롭게 작성해주세요."
                            maxLength={500}
                            value={inputTextReview}
                            onChange={(e) => setInputTextReview(e.target.value)}
                        />
                        <div className="char-count">
                            {inputTextReview.length} / 500자
                        </div>
                    </div>
                </div>

                <div className='review-section'>
                    <div className="review-label">
                        🔖 필사 (기억하고 싶은 문장)
                    </div>
                    <div className="transcription-input-group">
                        <input
                            type="text"
                            placeholder="명대사나 인상 깊은 문장을 적어주세요."
                            value={transcriptionInput}
                            onChange={(e) => setTranscriptionInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTranscription()}
                        />
                        <button className="btn-add-trans" onClick={handleAddTranscription}>추가</button>
                    </div>

                    {transcriptionList.length > 0 && (
                        <ul className="transcription-list">
                            {transcriptionList.map((item, index) => (
                                <li key={index} className="transcription-item">
                                    <span className="trans-text">"{item}"</span>
                                    <button className="btn-remove-trans" onClick={() => handleRemoveTranscription(index)}>✕</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='review-section review-bottom-section'>
                    <div className="photo-attachment-container">
                        <div className="review-label">
                            사진 첨부 <span className="optional">(선택, 최대 3장)</span>
                        </div>
                        <div className="photo-boxes">
                            <button className="photo-add-btn">
                                <span className="photo-icon">📷</span>
                                <span>추가</span>
                            </button>
                            <div className="photo-preview-box">
                                <span className="photo-icon">📷</span>
                                <button className="delete-photo-btn">✕</button>
                            </div>
                            <div className="photo-preview-box">
                                <span className="photo-icon">📷</span>
                                <button className="delete-photo-btn">✕</button>
                            </div>
                        </div>
                    </div>

                    <div className="spoiler-toggle-container">
                        <label className="spoiler-label">
                            <span className="spoiler-icon">⚠️</span> 스포일러 포함
                            <div className="toggle-switch off">
                                <div className="toggle-knob"></div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className='modal-actions review-actions'>
                    <button className='btn-cancel' onClick={onClose}>취소</button>
                    <button className='btn-submit' onClick={handleAddReview}>✍️ 리뷰 등록</button>
                </div>
            </div>
        </div>
    );
}

export default Reviewmodal;
