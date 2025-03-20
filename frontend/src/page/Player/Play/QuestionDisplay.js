import React from 'react';
import MDEditor from '@uiw/react-md-editor';

/**
 * 
 * @param {{
 * question: CauHoiWithLuaChonType,
 * answer: any
 * onAnswer: (a: any) => void
 * }} param0 
 * @returns 
 */
export default function QuestionDisplay({ question, onAnswer, answer }) {
    const colors = [
        "#FFEB3B",
        "#FF9800",
        "#F44336",
        "#03DAC6",
        "#E91E63",
        "#FFFFFF",
        "#90CAF9"
    ]

    const answers = question.lua_chon;
    return (
        <div className='question-wrapper' >
            <div className='question-wrapper__question'>
                <MDEditor.Markdown source={question?.noi_dung} style={{ backgroundColor: "transparent", fontSize: "1.3rem", fontFamily: "Roboto", whiteSpace: 'pre-wrap', maxWidth: '100%' }} />
            </div>
            <div className='question-wrapper__answers'>
                {answers.map((a, index) => (
                    <div key={index} className={'question-wrapper__answer' + (a.lua_chon_id == answer?.lua_chon_id ? ' question-wrapper__answer--selected' : '')} style={{
                        backgroundColor: colors[index],
                    }} onClick={() => onAnswer(a)}>
                        <input type='radio' name='answer' value={a} />
                        <MDEditor.Markdown source={a.noi_dung} style={{ backgroundColor: "transparent", fontSize: "1.3rem", fontFamily: "Roboto", whiteSpace: 'pre-wrap', maxWidth: '100%' }} />
                    </div>
                ))}
            </div>
        </div>
    )
}
