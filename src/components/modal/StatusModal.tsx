import { useState } from 'react';
import { supabase } from '../../supabase';
import './StatusModal.css';

interface StatusModalProps {
    onClose: () => void;
    libraryItem: any;
    onUpdate: () => void;
}

function StatusModal({ onClose, libraryItem, onUpdate }: StatusModalProps) {
    const [status, setStatus] = useState(libraryItem.status);
    const [currentPage, setCurrentPage] = useState(libraryItem.current_page || 0);
    const totalPages = libraryItem.Books?.total_pages || 0;

    const handleUpdateStatus = async () => {
        try {
            const updateData: any = {
                status: status,
                current_page: currentPage
            };

            // 상태에 따른 날짜 자동 업데이트 (선택 사항)
            if (status === '읽는 중' && !libraryItem.start_date) {
                updateData.start_date = new Date().toISOString();
            } else if (status === '읽음' && !libraryItem.end_date) {
                updateData.end_date = new Date().toISOString();
                updateData.current_page = totalPages; // 읽음으로 표시하면 마지막 페이지로 설정
            }

            const { error } = await supabase
                .from('MyLibrary')
                .update(updateData)
                .eq('mylibrary_id', libraryItem.mylibrary_id);

            if (error) throw error;

            alert('독서 상태가 업데이트되었습니다.');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('상태 업데이트 오류:', error);
            alert('상태 업데이트 중 오류가 발생했습니다.');
        }
    };

    const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

    return (
        <div className="modal-backdrop">
            <div className="status-modal-content">
                <div className="modal-header">
                    <h2>독서 상태 변경</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-book-preview">
                    <div className="preview-cover">
                        <img src={libraryItem.Books?.img} alt={libraryItem.Books?.title} />
                    </div>
                    <div className="preview-info">
                        <h3 className="preview-title">{libraryItem.Books?.title}</h3>
                        <p className="preview-author">{libraryItem.Books?.author}</p>
                        <p className="preview-meta">{libraryItem.Books?.publisher}</p>
                    </div>
                </div>

                <div className="status-selection-section">
                    <h3>현재 독서 상태</h3>
                    <div className="status-radio-group">
                        {['읽을 예정', '읽는 중', '읽음'].map((s) => (
                            <label key={s} className={`status-radio-label ${status === s ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="reading-status"
                                    value={s}
                                    checked={status === s}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
                                {s}
                            </label>
                        ))}
                    </div>
                </div>

                {status === '읽는 중' && (
                    <div className="progress-input-section">
                        <h3>독서 진행도</h3>
                        <div className="progress-inputs">
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={currentPage}
                                    onChange={(e) => setCurrentPage(Math.min(Number(e.target.value), totalPages))}
                                    min="0"
                                    max={totalPages}
                                />
                                <span>/ {totalPages} 페이지</span>
                            </div>
                            <div className="progress-percentage-badge">
                                {progress}% 완료
                            </div>
                        </div>
                        <input
                            type="range"
                            className="progress-range"
                            min="0"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => setCurrentPage(Number(e.target.value))}
                        />
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>취소</button>
                    <button className="btn-save" onClick={handleUpdateStatus}>저장하기</button>
                </div>
            </div>
        </div>
    );
}

export default StatusModal;
