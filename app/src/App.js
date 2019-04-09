import React, { Component } from 'react';
import './App.css';

import { connect } from 'react-redux';

class App extends Component {
  constructor(props)
  {
    super(props);
    // Bind the functions so that the functions' `this` variable will be set to the proper `this`
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleTagFilterChange = this.handleTagFilterChange.bind(this);
    this.handleTagKeyUp = this.handleTagKeyUp.bind(this);
  }
  /**
   * Handle the Name Filter Textarea onChange event
   * @param {Object} event 
   */
  handleFilterChange(event)
  {
    this.props.dispatch({type: "FILTER_UPDATE", data: event.target.value.toUpperCase()});
  }
  /**
   * Handle the Tag Filter textarea onChange event
   * @param {Object} event 
   */
  handleTagFilterChange(event)
  {
    this.props.dispatch({type: "TAG_UPDATE", data: event.target.value.toUpperCase()});
  }
  /**
   * Handle the Expanded Textarea's onKeyUp event.
   * @param {Object} event 
   * @param {Number} index The index of which textarea did this event, to properly relay to Redux store to update the proper data
   */
  handleTagKeyUp(event, index)
  {
    // If enter key
    if(event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      // Get the text area
      let tagTextArea = document.getElementById(`tagtextarea${index}`);
      // This is the value of the tag
      let val = tagTextArea.value;
      // If it's empty just don't bother, but reset the value to nothing
      if(val.trim() === "")
      {
        tagTextArea.value = "";
        return;
      }
      // Add new tag and set value back to nothing
      this.props.dispatch({type: "TAG_ADD", data: {index: index, tag: val }});

      tagTextArea.value = "";
    }
  }
  /**
   * Handle when the dropdown buttons are clicked
   * @param {Number} index The index of which associated dropdown button, to properly update state
   */
  handleDropdownClick(index)
  {
    console.log('click', index);
    this.props.dispatch({type: "TOGGLE_DISPLAY", data: index});
  }

  render() {
    // Array of elements to render
    let studentsToRender = [];
    // If we have data from the API
    if(this.props.Data !== null)
    {
      // Loop through the data
      for(let i in this.props.Data)
      {
        let student = this.props.Data[i];

        // Add filter check here
        let studentName = `${student.firstName} ${student.lastName}`.toUpperCase();
        // Doesn't include then it should not add this student to the view.
        // Empty filter ("") will return true
        if(!studentName.includes(this.props.Filter))
          continue;

        // Add filter for tags
        // Check if there's a non-empty filter for tags
        if(this.props.TagFilter.length > 0)
        {
          // If this student doesn't have registered tags, then we already know it won't have one that will match
          if(!student.tags)
            continue;
          // Keep track if this student has had a tag or not
          let hasTag = false;
          // Loop through the student's tags
          for(let j = 0; j < student.tags.length; j++)
          {

            // Find a match
            if(student.tags[j].toUpperCase().includes(this.props.TagFilter))
            {
              // If it has a tag, we can break out of the loop early
              hasTag = true;
              break;
            }
          }
          // If it doens't have a tag in the end, we shouldn't add this student to the view
          if(!hasTag)
            continue;
        }

        // The average of the student
        let average = 0;

        // Manually calculate average as there is an array of grades
        
        
        // Test score dropdown
        let expandedElementsToRender = [];
        // Loop through and add all grades
        for(let j = 0 ; j < student.grades.length; j++)
        {
          average += parseInt(student.grades[j]);
          // If expanded, add the element
          if(student.expanded)
            expandedElementsToRender.push(<div key={`student${i}score${j}`}>{`Test ${j+1}:    ${student.grades[j]}%`}</div>);
        }
        // Then divide by the length to obtain average
        average /= student.grades.length;


       
        // Tags and new tag text area
        if(student.expanded)
        {
          let tagsToRender = [];
          if(student.tags)
          {
            for(let j = 0; j < student.tags.length; j++)
            {
              tagsToRender.push(<div className="student-tag">{student.tags[j]}</div>)
            }
          }
          expandedElementsToRender.push(<div key={`student${i}expanded`}>

            <div className="tag-container">
              {tagsToRender}
            </div>
            <textarea id={`tagtextarea${i}`} onKeyUp={(event) => this.handleTagKeyUp(event, i)} className="tag-textarea" placeholder="Add a tag"/>
          
          </div>);
        }

        // Push what to render
        studentsToRender.push(<div key={i} className="student-container">
          <div className="picture-container">
            <img src={student.pic} alt="pic" className="student-picture"/>
          </div>
          <div className="student-details">
            <div className="student-header">
              <div className="student-name">
                {studentName}
              </div>
              <div className="dropdown-button" onClick={() => this.handleDropdownClick(i)}>
                {student.expanded ? "–" : "+"}
              </div>
            </div>
            <div className="student-body">
              <div>
                {`Email: ${student.email}`}
              </div>
              <div>
                {`Company: ${student.company}`}
              </div>
              <div>
                {`Skill: ${student.skill}`}
              </div>
              <div>
                {`Average: ${average}`}
              </div>
              {student.expanded &&
                <div className="student-tests">
                  <br/>
                  {expandedElementsToRender}
                </div>
                }
            </div>

            
          </div>

        </div>);

      }
    }
    return (
      <div className="App">
        <div className="list-container">
          {/* Name Filter */ }
          <textarea id="filter" className="filter-textarea" placeholder="Search by name" onChange={this.handleFilterChange} />
          {/* Tag Filter */ }
          <textarea id="tagfilter" className="filter-textarea" placeholder="Search by tags" onChange={this.handleTagFilterChange} />
          <div className="list-container-child">
            {studentsToRender}
          </div>
        </div>
      </div>
    );
  }
  // When the component first mounts
  componentDidMount()
  {
    // Fetch data from API
    fetch('/api/students').then(res => {

      if(res.ok)
      {
        res.json().then(json => {

          this.props.dispatch({type: "STUDENT_DATA", data: json.students});
        }).catch(err => console.log(err));
      }
      else
      {
        console.log(`Error Response from API; Response Code ${res.status}`);
      }

    }).catch(err => {
      console.log(err);
    })
    
  }
}
// Connect to the Redux Store to get the data we want to save
export default connect(state => {
  return {
    Data: state.students,
    Filter: state.filter,
    TagFilter: state.tagFilter
  };
})(App);