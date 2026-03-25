import { supabase } from '../../supabase';
import './DeleteModal.css';

interface Book {
    book_id: number
    title: string
}

interface DeleteModalProps {
    onClose: () => void;
    book: Book
}

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

const handleDeletBook = async (book: Book) => {
    try {
        const { error }
            = await supabase.from('MyLibrary')
                .delete()
                .eq('user_id', UUID)
                .eq('book_id', book.book_id)

        if (error) throw error;
    } catch (error) {
        console.log("내 서재에서 삭제하기 에러 : ", error)
    }
}

function DeleteModal({ onClose, book }: DeleteModalProps) {
    if (!book) return null;

    const executeDelete = async () => {
        await handleDeletBook(book);
        alert(`${book.title}이(가) 서재에서 삭제되었습니다.`);
        onClose();
        window.location.reload();
    }

    return (
        <div className="modal-backdrop">
            <div className="delete-modal-content">
                <div className="modal-header">
                    <h2>서재에서 책 삭제</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="delete-modal-body">
                    <p>정말 <strong>{book.title || '이 책'}</strong>을(를) 서재에서 삭제하시겠습니까?</p>
                    <p className="warning-text">이 작업은 취소할 수 없으며, 관련된 독서 기록이 모두 삭제됩니다.</p>
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>취소</button>
                    <button className="btn-save" onClick={executeDelete}>삭제하기</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
