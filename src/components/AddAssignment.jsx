import React from 'react'
import "../css/assignments.css"

const AddAssignment = () => {
  return (
    <div className='assignments-page'>
        <header>
          <h1>Add Assignment</h1>
          <button className='add-assignment-button'>Save Assignment</button>
        </header>
        <div className='add-assignment-body'>
          <input className='title-input' type='text'placeholder='Assignment Title'
          />
          <div className='filter-dropdowns'>
            <select>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="ge">German</option>
              <option value="fr">French</option>
              <option value="it">Italian</option>
            </select>
            <select></select>
            <select></select>
            <select></select>
          </div>
          <textarea className='assignment-text-input' placeholder='Write your assignment here'></textarea>
        </div>
    </div>
  )
}

export default AddAssignment
// import React, { useState } from 'react';
// import "../css/assignments.css";

// const blockTypes = {
//   TEXT: 'Text',
//   MULTIPLE_CHOICE: 'Multiple Choice',
//   SCALE: 'Scale',
//   IMAGE: 'Image',
//   VIDEO: 'Video',
// };

// const AddAssignment = () => {
//   const [blocks, setBlocks] = useState([]);

//   const addBlock = (type) => {
//     const newBlock = { type, content: '' };
//     setBlocks([...blocks, newBlock]);
//   };

//   return (
//     <div className='assignments-page'>
//         <header>
//           <h1>Add Assignment</h1>
//           <button className='add-assignment-button'>Save Assignment</button>
//         </header>
//         <div className='add-assignment-body'>
//           <input className='title-input' type='text' placeholder='Assignment Title' />
//           {/* Остальные поля фильтров... */}
//           <textarea className='assignment-text-input' placeholder='Write your assignment here'></textarea>
//           {/* Блоки для добавления контента */}
//           <div className='content-blocks'>
//             {blocks.map((block, index) => {
//               // Отображение блока в зависимости от типа
//               switch (block.type) {
//                 case blockTypes.TEXT:
//                   return <textarea key={index} className='assignment-text-input' placeholder='Text block'></textarea>;
//                 case blockTypes.MULTIPLE_CHOICE:
//                   return <div key={index}>/* Компонент вопроса с выбором ответов */</div>;
//                 // Добавьте сюда другие типы блоков...
//                 default:
//                   return null;
//               }
//             })}
//           </div>
//           {/* Панель для добавления новых блоков */}
//           <div className='add-blocks-bar'>
//             {Object.values(blockTypes).map((type) => (
//               <button key={type} onClick={() => addBlock(type)}>
//                 Add {type}
//               </button>
//             ))}
//           </div>
//         </div>
//     </div>
//   )
// }

// export default AddAssignment;
