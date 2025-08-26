import React, { useState, useEffect } from 'react';
import { Button } from '../../../Common/Components/BaseComponents/Button';
import { SelectField } from "../../../Common/Components/BaseComponents/Select";

type TransferPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    occupiedRoom: { id: string; name: string; customerId: string };
    availableRooms: { id: string; name: string }[];
    occupiedRooms: { id: string; name: string; customerId: string }[];
    onConfirmSwap: (roomId1: string, roomId2: string) => void;
    onConfirmMove: (newRoomId: string) => void;
};

export const TransferPanel: React.FC<TransferPanelProps> = ({
    isOpen,
    onClose,
    occupiedRoom,
    availableRooms,
    occupiedRooms,
    onConfirmSwap,
    onConfirmMove,
}) => {
    const [step, setStep] = useState<'question' | 'options' | 'selectRoom'>('question');
    const [mode, setMode] = useState<'swap' | 'move' | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setStep('question');
            setMode(null);
            setSelectedRoomId('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNext = () => setStep('options');
    const handleSelectMode = (mode: 'swap' | 'move') => {
        setMode(mode);
        setStep('selectRoom');
    };
    const handleConfirm = () => {
        if (mode === 'swap') onConfirmSwap(occupiedRoom.id, selectedRoomId);
        else if (mode === 'move') onConfirmMove(selectedRoomId);
        onClose();
    };

    const roomOptions = mode === 'swap'
        ? occupiedRooms.filter(r => r.id !== occupiedRoom.id)
        : availableRooms;

    return (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white border rounded-xl shadow-xl p-6 w-[400px] space-y-4">
            {step === 'question' && (
                <>
                    <p className="text-lg font-semibold">
                        החלל תפוס, אי אפשר להקצות אותו ללקוח נוסף. האם אתה רוצה להעביר את הלקוח לחלל חדש?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={onClose}>ביטול</Button>
                        <Button onClick={handleNext}>כן</Button>
                    </div>
                </>
            )}

            {step === 'options' && (
                <>
                    <p>בחר פעולה:</p>
                    <div className="flex gap-4">
                        <Button onClick={() => handleSelectMode('swap')}>החלף עם לקוח אחר</Button>
                        <Button onClick={() => handleSelectMode('move')}>הקצה חלל פנוי</Button>
                    </div>
                </>
            )}

            {step === 'selectRoom' && (
                <>
                    <p>בחר חלל {mode === 'swap' ? 'לתחלופה' : 'לפינוי'}:</p>
                    <SelectField
                        name="selectedRoomId"
                        label="בחר חלל"
                        options={roomOptions.map(room => ({
                            value: room.id,
                            label: room.name
                        }))}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="secondary" onClick={onClose}>ביטול</Button>
                        <Button disabled={!selectedRoomId} onClick={handleConfirm}>אישור</Button>
                    </div>
                </>
            )}
        </div>
    );
};
