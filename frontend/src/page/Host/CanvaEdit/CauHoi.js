import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import api_config from '../../../config/api_config';
import './CanvaEdit.css';

function QuestionInfo({ index, timeLimit, setTimeLimit, handleDelete, handleSave }) {
    return (
        <div className='question-item-info'>
            <p className='question-item-info-title'>
                <h3>
                    Câu hỏi {index + 1}:
                </h3>
                <p>
                    <input className='question-time-limit' value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}></input>
                    S
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

function Question({ index, item, onChange, onDelete }) {
    const [content, setContent] = React.useState(item.noi_dung);
    const [choices, setChoices] = React.useState(item.lua_chon);
    const [timeLimit, setTimeLimit] = React.useState(item.thoi_gian);

    const handleSave = () => {
        const promises = [];
        promises.push(updateQuestion(item.cau_hoi_id, item.canva_id, content, item.dinh_dang, timeLimit));
        choices?.forEach((choice) => {
            promises.push(updateChoice(choice));
        });

        Promise.all(promises).then(() => {
            alert('Save success');
        }).catch(() => {
            alert('Save fail');
        });
    };

    const handleDelete = () => {
        deleteQuestion(item.cau_hoi_id, onDelete);
    };

    const handleAddChoice = () => {
        addChoice(item.cau_hoi_id, choices, setChoices);
    };

    const handleDeleteChoice = (choice_id) => {
        deleteChoice(choice_id, choices, setChoices);
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

function updateQuestion(question_id, canvas_id, content, format, timeLimit) {
    return fetch(api_config.cau_hoi.updateCauHoi + question_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            canva_id: canvas_id,
            noi_dung: content,
            dinh_dang: format,
            thoi_gian: timeLimit
        })
    });
}

function updateChoice(choice) {
    return fetch(api_config.cau_hoi.updateLuaChon + choice.lua_chon_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(choice)
    });
}

function deleteQuestion(question_id, onDelete) {
    fetch(api_config.cau_hoi.deleteCauHoi + question_id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((data) => {
            onDelete();
        }).catch(error => {
            console.error(error);
            alert('Delete fail');
        });
}

function addChoice(question_id, choices, setChoices) {
    fetch(api_config.cau_hoi.addLuaChon, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cau_hoi_id: question_id,
            noi_dung: '',
            dung: false
        })
    }).then((res) => res.json()).then((data) => {
        setChoices([...choices || [], {
            lua_chon_id: data.insertId,
            noi_dung: '',
            dung: false
        }]);
    }).catch(error => {
        console.error('Error adding choice:', error);
        alert('Add fail');
    });
}

function deleteChoice(choice_id, choices, setChoices) {
    fetch(api_config.cau_hoi.updateLuaChon + choice_id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        setChoices([...choices?.filter(e => e.lua_chon_id !== choice_id)]);
    }).catch(error => {
        console.error('Error deleting choice:', error);
        alert('Delete fail');
    });
}

export default Question;
