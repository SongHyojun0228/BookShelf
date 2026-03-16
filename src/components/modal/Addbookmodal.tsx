import { useState } from 'react';
import { supabase } from '../../supabase';
import './Addbookmodal.css';

interface AddBookModalProps {
    onClose: () => void;
    book: any;
}

const UUID = '77e29bf2-9409-4ef5-94aa-5bfdd2d6a0a3';

function Addbookmodal({ onClose, book }: AddBookModalProps) {

    const [readingStatus, setReadingStatus] = useState('reading');

    const handleAddMyLibrary = async () => {
        let mappedStatus = '읽는 중';
        if (readingStatus == 'todo') mappedStatus = '읽을 예정'
        if (readingStatus == 'done') mappedStatus = '읽음'

        try {
            const { data: bookData, error: bookError }
                = await supabase.from('Books')
                    .insert([
                        {
                            title: book.title,
                            author: book.author,
                            publisher: book.publisher,
                            img: book.cover,
                            genre: book.categoryName || '기타',
                            total_pages: book.subInfo?.itemPage || 0
                        }
                    ])
                    .select();

            if (bookError) {
                throw bookError;
            }

            const insertedBookId = bookData[0].book_id;

            // 오늘 날짜 구하기 (YYYY-MM-DD 형식)
            const today = new Date().toISOString().split('T')[0];

            let insertData: any = {
                user_id: UUID,
                book_id: insertedBookId,
                status: mappedStatus
            };

            // 읽는 중이면 시작일을 오늘로, 다 읽었으면 종료일을 오늘로 지정
            if (mappedStatus === '읽는 중') {
                insertData.start_date = today;
            } else if (mappedStatus === '읽음a') {
                insertData.end_date = today;
            }

            const { error: libraryError } = await supabase.from('MyLibrary')
                .insert([insertData])
                .select();

            if (libraryError) throw libraryError;

            alert(`서재에 ${bookData[0].title}이(가) 담겼습니다.`);
            onClose();
        } catch (error) {
            console.log("handleAddMyLibrary in Addbookmodal 오류 : ", error)
        }
    }

    return (
        <div className='modal-backdrop'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h2>서재에 담기</h2>
                    <button className='close-btn' onClick={onClose}>✕</button>
                </div>

                <div className='modal-book-preview'>
                    <div className='preview-cover'>
                        <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className='preview-info'>
                        <h3 className='preview-title'>{book.title}</h3>
                        <p className='preview-author'>{book.author}</p>
                        <p className='preview-meta'>{book.pubDate ? book.pubDate.substring(0, 4) : ''} · {book.categoryName} · {book.publisher}</p>
                        <p className='preview-rating'>⭐ {book.customerReviewRank} {book.subInfo?.itemPage ? `· ${book.subInfo.itemPage}페이지` : ''}</p>
                    </div>
                </div>

                <div className='modal-section'>
                    <div className='section-title'>
                        <h3>읽기 상태 선택</h3>
                        <p>현재 이 책의 상태를 선택해주세요</p>
                    </div>
                    <div className='status-options'>
                        <label className={`status-option ${readingStatus === 'todo' ? 'selected' : ''}`}>
                            <div className='status-icon'>📖</div>
                            <div className='status-text'>
                                <h4>읽을 예정</h4>
                                <p>나중에 읽을 책 목록에 추가</p>
                            </div>
                            <input
                                type='radio'
                                name='readingStatus'
                                value='todo'
                                checked={readingStatus === 'todo'}
                                onChange={(e) => setReadingStatus(e.target.value)}
                            />
                        </label>

                        <label className={`status-option ${readingStatus === 'reading' ? 'selected' : ''}`}>
                            <div className='status-icon'>📖</div>
                            <div className='status-text'>
                                <h4>읽는 중</h4>
                                <p>현재 읽고 있는 책으로 등록</p>
                            </div>
                            <input
                                type='radio'
                                name='readingStatus'
                                value='reading'
                                checked={readingStatus === 'reading'}
                                onChange={(e) => setReadingStatus(e.target.value)}
                            />
                        </label>

                        <label className={`status-option ${readingStatus === 'done' ? 'selected' : ''}`}>
                            <div className='status-icon'>📖</div>
                            <div className='status-text'>
                                <h4>읽음</h4>
                                <p>다 읽은 책으로 등록 (별점 입력 가능)</p>
                            </div>
                            <input
                                type='radio'
                                name='readingStatus'
                                value='done'
                                checked={readingStatus === 'done'}
                                onChange={(e) => setReadingStatus(e.target.value)}
                            />
                        </label>
                    </div>
                </div>

                <div className='modal-section'>
                    <div className='section-title'>
                        <h3>태그 추가 (선택)</h3>
                    </div>
                    <input type='text' className='tag-input' placeholder='# 태그를 입력하세요...' />
                    <div className='tag-pills'>
                        <span className='tag-pill'>#소설</span>
                        <span className='tag-pill'>#한국문학</span>
                        <span className='tag-pill'>#베스트셀러</span>
                    </div>
                </div>

                <div className='modal-actions'>
                    <button className='btn-cancel' onClick={onClose}>취소</button>
                    <button className='btn-submit' onClick={handleAddMyLibrary}>서재에 담기</button>
                </div>
            </div>
        </div>
    )
}

export default Addbookmodal;