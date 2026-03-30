import { useState, useEffect } from 'react';
import './ReviewDetailModal.css';
import { supabase } from '../../supabase';

interface ReviewDetailModalProps {
    onClose: () => void;
    review: any;
}

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

function ReviewDetailModal({ onClose, review }: ReviewDetailModalProps) {
    if (!review) return null;

    const [transcriptions, setTranscriptions] = useState<string[]>();
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const handleTranscription = async () => {
            try {
                const { data: transcriptionData, error: transcriptionError }
                    = await supabase.from('Transcriptions')
                        .select(`
                            *,
                            Books(*),
                            Users(*)    
                        `)
                        .eq('user_id', review.Users.user_id)
                        .eq('book_id', review.Books.book_id);

                if (transcriptionError) throw transcriptionError;

                setTranscriptions(transcriptionData);
            } catch (error) {
                console.log("리뷰 상세보기 오류 : ", error)
            }
        }

        const checkLikeStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('Likes')
                    .select('*')
                    .eq('review_id', review.review_id)
                    .eq('user_id', UUID)
                    .single();

                if(error) throw error;

                if (data) setIsLiked(true);
            } catch (error) {
                console.log("좋아요 상태 확인 에러 : ", error);
            }
        }

        handleTranscription();
        checkLikeStatus();
    }, [])

    const handleAddLike = async () => {
        try {
            if (isLiked) {
                const { error: unlikeError } = await supabase
                    .from('Likes')
                    .delete()
                    .eq('review_id', review.review_id)
                    .eq('user_id', UUID);

                if (unlikeError) throw unlikeError;
                setIsLiked(false);
            } else {
                const { error: likeError } = await supabase
                    .from('Likes')
                    .insert([{
                        user_id: UUID,
                        review_id: review.review_id,
                    }])

                if (likeError) throw likeError;
                setIsLiked(true);
            }
        } catch (error) {
            console.log("좋아요 처리 에러 : ", error);
        }
    }

    const userName = review.Users?.nickname;
    const bookTitle = review.Books?.title;
    const bookAuthor = review.Books?.author;
    const userInitial = userName?.[0] || '?';

    return (
        <div className="modal-backdrop">
            <div className="review-detail-content">
                <button className="close-btn detail-close" onClick={onClose}>✕</button>

                <div className="detail-layout">
                    {/* 왼쪽: 도서 정보 섹션 */}
                    <div className="detail-book-side">
                        <div className="detail-cover">
                            <img src={review.Books?.img} alt={bookTitle} />
                        </div>
                        <div className="detail-book-info">
                            <h2 className="detail-book-title">{bookTitle}</h2>
                            <p className="detail-book-author">{bookAuthor}</p>
                            <span className="detail-book-genre">{review.Books?.genre || '장르 정보 없음'}</span>
                        </div>
                    </div>

                    {/* 오른쪽: 리뷰 및 활동 섹션 */}
                    <div className="detail-review-side">
                        <div className="detail-user-header">
                            <div className="detail-avatar">{userInitial}</div>
                            <div className="detail-user-text">
                                <span className="detail-user-name">{userName}</span>
                                <span className="detail-date">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <button className="btn-follow-small">팔로우</button>
                        </div>

                        <div className="detail-rating-row">
                            <span className="detail-stars">
                                {'★'.repeat(review.star || 0)}{'☆'.repeat(5 - (review.star || 0))}
                            </span>
                            <span className="detail-likes">❤️ {review.likes_count}명이 좋아합니다</span>
                        </div>

                        <div className="detail-content-box">
                            <p className="detail-description">
                                {review.description}
                            </p>
                        </div>

                        {/* 필사 섹션 (UI 가이드) */}
                        <div className="detail-transcription-section">
                            <h3>🔖 기억하고 싶은 문장 (필사)</h3>
                            <div className="detail-trans-list">
                                {
                                    transcriptions?.length ? (
                                        transcriptions.map((transcription: any, index: number) => (
                                            <div key={index} className="trans-item">
                                                <p>"{transcription.description}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="trans-empty-msg">기록된 필사가 없습니다.</p>
                                    )
                                }
                            </div>
                        </div>

                        <div className="detail-actions">
                            <button
                                className={`action-btn like-btn ${isLiked ? 'active' : ''}`}
                                onClick={handleAddLike}
                            >
                                ❤️ {isLiked ? '좋아요 취소' : '좋아요'}
                            </button>
                            <button className="action-btn comment-btn">💭 댓글 달기</button>
                            <button className="action-btn share-btn">🔗 공유</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewDetailModal;
