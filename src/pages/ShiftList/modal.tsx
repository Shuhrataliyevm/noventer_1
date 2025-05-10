import "../../styles/modal.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    shiftName: string;
    setShiftName: React.Dispatch<React.SetStateAction<string>>;
    startTime: string;
    setStartTime: React.Dispatch<React.SetStateAction<string>>;
    endTime: string;
    setEndTime: React.Dispatch<React.SetStateAction<string>>;
    isEditMode: boolean;
}

const Modal = ({
    isOpen,
    onClose,
    onSubmit,
    shiftName,
    setShiftName,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    isEditMode,
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <div className="modal-header">
                    <h2>{isEditMode ? "Smena tahrirlash" : "Smena qo'shish"}</h2>
                    <button className="close-btn" onClick={onClose}>X</button>
                </div>

                <div className="modal-body">
                    <div className="input-group">
                        <label>Smena nomi</label>
                        <input
                            type="text"
                            value={shiftName}
                            onChange={(e) => setShiftName(e.target.value)}
                            placeholder="Smena nomi"
                        />
                    </div>
                    <div className="input-group">
                        <label>Boshlаnish vaqti</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Tugash vaqti</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Bekor qilish</button>
                    <button className="submit-btn" onClick={onSubmit}>
                        {isEditMode ? "O'zgartirish" : "Qo'shish"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
