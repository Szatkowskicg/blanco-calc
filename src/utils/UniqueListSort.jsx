import React from 'react';

const UniqueList = ({ data, label, id, onChange, selectedValue}) => {
    // Extract, split, deduplicate, and sort items
    const itemsSet = new Set();
    data.forEach(entry => {
      entry.items.forEach(item => {
        item.name.split(",").forEach(value => {
          itemsSet.add(value.trim());
        });
      });
    });
    
    // Convert Set back to Array and sort it
    const uniqueItems = Array.from(itemsSet).sort((a, b) => {
      // For alphabetic sorting
      return a.localeCompare(b);
    });
  
    return (
      <div className={`col`} data-label={label}>
        <input className="input-field" list={id} onChange={onChange} value={selectedValue}/>
        <datalist id={id}>
          {uniqueItems.map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </datalist>
      </div>
    );
  };
  
  export default UniqueList;