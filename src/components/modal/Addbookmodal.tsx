import { useState } from 'react';
import './Addbookmodal.css';

interface AddBookModalProps {
    onClose: () => void;
}

function Addbookmodal({ onClose }: AddBookModalProps) {
    // 읽기 상태를 관리하는 state (기본값: 'reading')
    const [readingStatus, setReadingStatus] = useState('reading');


    return (
        <div className='modal-backdrop'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h2>서재에 담기</h2>
                    <button className='close-btn'  onClick={onClose}>✕</button>
                </div>

                <div className='modal-book-preview'>
                    <div className='preview-cover'>
                        <span className='no-image'>이미지 없음</span>
                    </div>
                    <div className='preview-info'>
                        <h3 className='preview-title'>불편한 편의점</h3>
                        <p className='preview-author'>김호연</p>
                        <p className='preview-meta'>2021 · 소설 · 나무옆의자</p>
                        <p className='preview-rating'>⭐ 4.2 · 237페이지</p>
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
                    <button className='btn-submit'>서재에 담기</button>
                </div>
            </div>
        </div>
    )
}

export default Addbookmodal;