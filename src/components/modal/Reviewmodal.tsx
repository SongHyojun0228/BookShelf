import { useState } from 'react';
import { supabase } from '../../supabase';
import './Reviewmodal.css';

interface ReviewModalProps {
    onClose: () => void;
    book: any;
}

const UUID = '77e29bf2-9409-4ef5-94aa-5bfdd2d6a0a3';

function Reviewmodal({ onClose, book }: ReviewModalProps) {

    const [stars, setStars] = useState(0);
    const [inputTextReview, setInputTextReview] = useState('');

    const handleAddReview = async () => {
        try {
            const { error: bookError }
                = await supabase.from('Reviews')
                    .insert([{
                        user_id: UUID,
                        book_id: book.book_id,
                        description: inputTextReview,
                        star: stars
                    }])

            if (bookError) {
                throw bookError;
            }

            console.log("리뷰 쓰기 함수 발동!!!!!")
            alert(`${book.title} 리뷰 작성 완료~!`)
            onClose();
        } catch (error) {
            console.log("리뷰 작성 중 오류 : ", error);
        }
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
                                    className='star-btn'
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
                            0 / 500자
                        </div>
                    </div>
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
