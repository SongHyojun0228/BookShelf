import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import './Reviewmodal.css';
import Loading from '../common/Loading';

interface ReviewModalProps {
    onClose: () => void;
    onSuccess: () => void;
    book: any;
}

interface ReView {
    user_id: number
    description: string
    star: number
    is_spoiler: boolean
}

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

function Reviewmodal({ onClose, book, onSuccess }: ReviewModalProps) {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading_Transcription, setIsLoading_Transcription] = useState(false);
    const [writtenReview, setWrittenReview] = useState<ReView | undefined>()
    const [stars, setStars] = useState(0);
    const [inputTextReview, setInputTextReview] = useState('');
    const [transcriptionInput, setTranscriptionInput] = useState('');
    const [transcriptionList, setTranscriptionList] = useState<string[]>([]);
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    useEffect(() => {
        const fetchBookReview = async () => {
            setIsLoading(true);

            try {
                const { data, error } =
                    await supabase.from('Reviews')
                        .select(`*`)
                        .eq('user_id', UUID)
                        .eq('book_id', book.book_id)

                if (error) throw error

                if (data && data.length > 0) {
                    setWrittenReview(data[0]);
                    setStars(data[0].star || 0);
                    setInputTextReview(data[0].description || '');
                    setIsSpoiler(data[0].is_spoiler || false);
                    if (data[0].image_urls) {
                        setPreviewUrls(data[0].image_urls);
                    }
                    console.log("불러온 리뷰 : ", data[0]);
                }
            } catch (error) {
                console.log("리뷰 불러오기 에러 : ", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBookReview();
    }, []);

    useEffect(() => {
        setIsLoading_Transcription(true);

        const fetchBookTranscription = async () => {
            try {
                const { data, error } =
                    await supabase.from('Transcriptions')
                        .select(`*`)
                        .eq('user_id', UUID)
                        .eq('book_id', book.book_id);

                if (error) throw error

                if (data && data.length > 0) {
                    setTranscriptionList(data.map((t: any) => t.description));
                }
            } catch (error) {
                console.log("필사 불러오기 에러 : ", error)
            } finally {
                setIsLoading_Transcription(false);
            }
        }

        fetchBookTranscription();
    }, [])

    const handleAddReview = async () => {
        if (writtenReview) {
            try {
                // 1. 새 이미지 업로드 (추가된게 있다면)
                let currentImageUrls = [...(writtenReview as any).image_urls || []];
                
                if (selectedFiles.length > 0) {
                    console.log("[수정] 이미지 업로드 시작. 대상 파일 수:", selectedFiles.length);
                    const newUploadedUrls: string[] = [];
                    for (const file of selectedFiles) {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
                        console.log(`[수정] 업로드 시도: ${fileName}`);
                        const { error: uploadError } = await supabase.storage
                            .from('review_images')
                            .upload(fileName, file);
                        
                        if (uploadError) {
                            console.error("[수정] 개별 이미지 업로드 실패:", uploadError.message);
                            continue;
                        }

                        const { data: { publicUrl } } = supabase.storage
                            .from('review_images')
                            .getPublicUrl(fileName);
                        newUploadedUrls.push(publicUrl);
                        console.log("[수정] 개별 이미지 저장 완료:", publicUrl);
                    }
                    currentImageUrls = [...currentImageUrls, ...newUploadedUrls];
                }

                const { error } =
                    await supabase.from('Reviews')
                        .update({
                            description: inputTextReview,
                            star: stars,
                            is_spoiler: isSpoiler,
                            image_urls: currentImageUrls
                        })
                        .eq('user_id', UUID)
                        .eq('book_id', book.book_id)

                if (error) {
                    throw error;
                }

                // 기존 필사 목록 초기화 (삭제)
                await supabase.from('Transcriptions')
                    .delete()
                    .eq('user_id', UUID)
                    .eq('book_id', book.book_id);

                // 현재 UI에 남은 필사 목록만 새로 저장
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

                alert(`${book.title} 리뷰와 필사가 수정	되었습니다.`)
            } catch (error) {
                console.log("리뷰 수정 에러 : ", error);
            }
        } else {
            try {
                // 1. 이미지가 있다면 Supabase Storage에 업로드
                let uploadedImageUrls: string[] = [];

                if (selectedFiles.length > 0) {
                    console.log("[등록] 이미지 업로드 시작. 대상 파일 수:", selectedFiles.length);
                    for (const file of selectedFiles) {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
                        console.log(`[등록] 업로드 시도: ${fileName}`);
                        const { error: uploadError } = await supabase.storage
                            .from('review_images')
                            .upload(fileName, file);

                        if (uploadError) {
                            console.error("[등록] 개별 이미지 업로드 실패:", uploadError.message);
                            continue;
                        }

                        const { data: { publicUrl } } = supabase.storage
                            .from('review_images')
                            .getPublicUrl(fileName);
                        
                        uploadedImageUrls.push(publicUrl);
                        console.log("[등록] 개별 이미지 저장 완료:", publicUrl);
                    }
                }

                // 2. 리뷰 저장
                const { error: reviewError }
                    = await supabase.from('Reviews')
                        .insert([{
                            user_id: UUID,
                            book_id: book.book_id,
                            description: inputTextReview,
                            star: stars,
                            is_spoiler: isSpoiler,
                            image_urls: uploadedImageUrls
                        }])

                if (reviewError) throw reviewError;

                // 3. 필사 목록 저장 (있을 경우에만)
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

                console.log("리뷰 저장 완료!!!!!")
                alert(`${book.title} 리뷰와 필사가 등록되었습니다.`)

                if (onSuccess) onSuccess();

                onClose();
            } catch (error) {
                console.log("리뷰 저장 중 오류 : ", error);
            }
        }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        // 3장 제한
        if (selectedFiles.length + files.length > 3) {
            alert("사진은 최대 3장까지만 첨부 가능합니다.");
            return;
        }

        // 파일 상태 저장
        setSelectedFiles(prev => [...prev, ...files])

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }

    const handleRemoveImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

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
                {(isLoading || isLoading_Transcription) ? <div style={{ display: 'flex', justifyContent: 'center', margin: '50px 0' }}>
                    <Loading text="리뷰 및 필사 조회" />
                </div> :
                    <>
                        <div className='modal-header'>
                            <h2><span className="header-icon">✍️</span> {writtenReview ? '리뷰 수정' : '리뷰 쓰기'}</h2>
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
                                    <label className="photo-add-btn" style={{ cursor: 'pointer' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: 'none' }}
                                            onChange={handleImageSelect}
                                        />
                                        <span className="photo-icon">📷</span>
                                        <span>추가</span>
                                    </label>
                                    
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="photo-preview-box">
                                            <img src={url} alt={`preview-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                            <button className="delete-photo-btn" onClick={() => handleRemoveImage(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="spoiler-toggle-container">
                                <label className="spoiler-label" style={{ cursor: 'pointer' }} onClick={() => setIsSpoiler(!isSpoiler)}>
                                    <span className="spoiler-icon">⚠️</span> 스포일러 포함
                                    <div className={`toggle-switch ${isSpoiler ? 'on' : 'off'}`}>
                                        <div className="toggle-knob"></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className='modal-actions review-actions'>
                            <button className='btn-cancel' onClick={onClose}>취소</button>
                            <button className='btn-submit' onClick={handleAddReview}>✍️ {writtenReview ? '수정 완료' : '리뷰 등록'}</button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default Reviewmodal;
