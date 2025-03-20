import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import './CanvaEdit.css';
import api from '../../../services/api';
import { toast } from 'react-toastify';

function QuestionInfo({ index, timeLimit, setTimeLimit, handleDelete, handleSave }) {
    return (
        <div className='question-item-info'>
            <p className='question-item-info-title'>
                <h3>
                    Câu hỏi {index + 1}:
                </h3>
                <p>
                    <input className='question-time-limit' value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}></input>
                </p>
            </p>
            <span>
                <button className='btn btn-danger' onClick={handleDelete}>delete</button>
                <button className='btn' onClick={handleSave}>Save</button>
            </span>
        </div>
    );
}

function QuestionContent({ content, setContent }) {
    return (
        <div className='question-item-content'>
            <MDEditor value={content} onChange={setContent} preview="edit" commands={[]} />
        </div>
    );
}

function QuestionChoices({ choices, setChoices, handleAddChoice, handleDeleteChoice }) {
    return (
        <div className='question-item-choices'>
            {choices?.map((item, index) => (
                <div key={index} className={'question-item-choice'}>
                    <input type='checkbox' checked={item.dung} onChange={e => {
                        const newChoices = [...choices];
                        newChoices[index].dung = e.target.checked;
                        setChoices(newChoices);
                    }} />
                    <button className='btn btn-danger' onClick={() => handleDeleteChoice(item.choice_id)}>delete</button>
                    <MDEditor value={item.noi_dung} onChange={(e) => {
                        const newChoices = [...choices];
                        newChoices[index].noi_dung = e;
                        setChoices(newChoices);
                    }} preview="edit" commands={[]} height={'auto'} />
                </div>
            ))}
            <div className='question-item-add-choice' onClick={handleAddChoice}>
                Thêm lựa chọn
            </div>
        </div>
    );
}

/**
 * 
 * @param {{
 * index: number;
 * item: CauHoiWithLuaChonType;
 * onDelete: (question_id: number) => void;
 * }} param0 
 * @returns 
 */
function Question({ index, item, onDelete }) {
    /** @type {useStateReturnType<string>} */
    const [content, setContent] = React.useState(item.noi_dung);
    /** @type {useStateReturnType<CauHoiWithLuaChonType['lua_chon']>} */
    const [choices, setChoices] = React.useState(item.lua_chon);
    const [timeLimit, setTimeLimit] = React.useState(item.thoi_gian);

    const handleSave = () => {
        api.cauHoiApi.update(item.cau_hoi_id, {
            noi_dung: content,
            thoi_gian: timeLimit,
            lua_chon: choices
        }).then((resp) => {
            toast.success('Save success');
        }).catch(error => {
            console.error('Error saving question:', error);
            toast.error('Save fail');
        });
    };

    const handleDelete = () => {
        api.cauHoiApi.delete(item.cau_hoi_id).then(() => {
            onDelete(item.cau_hoi_id);
        }).catch(error => {
            console.error('Error deleting question:', error);
            toast.error('Delete fail');
        });
    };

    const handleAddChoice = () => {
        api.cauHoiApi.createChoice(item.cau_hoi_id, {
            noi_dung: '',
            dung: false
        }).then((resp) => {
            setChoices([...choices, {
                noi_dung: '',
                dung: false,
                lua_chon_id: resp.insertId,
                cau_hoi_id: item.cau_hoi_id
            }]);
        }).catch(error => {
            console.error('Error adding choice:', error);
            toast.error('Add fail');
        });
    };

    const handleDeleteChoice = (choice_index) => {
        api.cauHoiApi.deleteChoice(item.cau_hoi_id, choices[choice_index].lua_chon_id).then(() => {
            setChoices(choices.filter((_, index) => index !== choice_index));
        }).catch(error => {
            console.error('Error deleting choice:', error);
            toast.error('Delete fail');
        });

    };

    console.log(choices)

    return (
        <div className='question-item'>
            <QuestionInfo index={index} timeLimit={timeLimit} setTimeLimit={setTimeLimit} handleDelete={handleDelete} handleSave={handleSave} />
            <QuestionContent content={content} setContent={setContent} />
            <QuestionChoices choices={choices} setChoices={setChoices} handleAddChoice={handleAddChoice} handleDeleteChoice={handleDeleteChoice} />
        </div>
    );
}

export default Question;
