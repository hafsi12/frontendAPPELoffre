import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/dashboard.css"; // Import the CSS file

import CustomChart from "./customChart";
import { color } from "chart.js/helpers";

function Chatbot() {
  

  const [question, setQuestion] = useState(""); // Current question
  const [conversation, setConversation] = useState([]); // List of questions and answers
  const conversationEndRef = useRef(null); // Ref to track the conversation container
  const [isDeleteVisible, setIsDeleteVisible] = useState(true); // New state for delete div visibility



  // Handle question input
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  // Simulate receiving an answer
  const getAnswer = (questionText) => {
    // Replace this logic with an API call if needed
    return `This is a response to: "${questionText}"`;
  };

  // Handle submitting the question
  const handleSubmitQuestion = () => {
    if (question.trim()) {
      // Add the question to the conversation
      const newConversation = [...conversation, { question, answer: null }];
      setConversation(newConversation);

      // Simulate receiving the answer after a short delay
      setTimeout(() => {
        const answer = getAnswer(question);
        setConversation((prev) =>
          prev.map((item, index) =>
            index === prev.length - 1 ? { ...item, answer } : item
          )
        );
      }, 1000);

      // Clear the input field
      setQuestion("");
    }
  };

// Scroll to the bottom of the conversation
const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);


  {/*---------------------------------------------------------------------------------*/}

  return (
    <div class="p-2 pt-2 pb-0 flex-grow:1" style={{ backgroundColor: "white" }}>
      <div
        className="d-flex flex-column p-3 align-items-center shadow-lg rounded-4  "
        style={{
          background:"linear-gradient(to bottom right,rgba(65, 189, 31, 0.51),rgba(60, 142, 201, 0.51),rgba(210, 171, 31, 0.69))",
          
        }}
      >
        <div
          className="d-flex flex-column p-4 align-items-center shadow-lg rounded-4 w-100 "
          style={{ backgroundColor: "white",minHeight:'82vh' }} // Make content scrollable
        >
          
          {/* Header */}

          <div class="d-flex flex-column w-100 ">
            <div
              className="d-flex flex-row w-100 align-items-center"
              style={{ backgroundColor: "white" }}
            >
              <img
                src="pp.png"
                alt="chatbot Icon"
                className="me-4"
                style={{ width: "50px", height: "auto" }}
              />
              <h5>Questionner l'Intelligence Artifitielle</h5>
            </div>

            <hr
              className="custom-hr mb-5"
              style={{ width: "100%", height: "4px" }}
            />
          </div>

          {/* content */}

          <div class="align-items-center w-100 pe-3" style={{backgroundColor:'white',maxHeight: "45vh", overflowY: "auto"}}>
            <div id='delete'>
            <div className="d-flex justify-content-start">
              <div
                className="d-flex rounded-4 p-4 pt-2 pb-2 me-auto mb-3"
                style={{ backgroundColor: "rgb(236, 236, 241)",fontSize:'14px' }}
              >
                Bonjour! Comment puis-je vous aider ? Voulez-vous communiquer
                avec votre base de données ?
              </div>
            </div>

            {/* prompts */}
            

            <div
              className="d-flex justify-content-end w-100 mb-3 "
              style={{ backgroundColor: "white" }}
            >
              <button
                className="btn btn-sm rounded-4 p-4 pt-2 pb-2"
                style={{
                  color: "rgb(29, 115, 82)",fontSize:'14px', 
                  backgroundColor: "rgba(31, 189, 155, 0.17)",
                }}
              >
                Quel est l'enseignant ayant le moins d'éléments ?
              </button>
            </div>

            <div
              className="d-flex justify-content-end w-100 mb-4"
              style={{ backgroundColor: "white" }}
            >
              <button
                className="btn btn-sm rounded-4 p-4 pt-2 pb-2 "
                style={{
                  color: "rgb(29, 115, 82)",
                  backgroundColor: "rgba(31, 189, 155, 0.17)",fontSize:'14px' 
                }}
              >
                Donner les noms des éléments pour lesquels les enseignants n'ont
                pas encore entré les notes ?
              </button>
            </div>
            </div>
            

            {/*Question and Answer -----------------------------------------------------------------------------*/}

            {conversation.map((item, index) => (
              <div key={index} className="mb-4">
                {/* Question */}
                <div className="d-flex justify-content-start mb-4 mt-4">
                  <div
                    className="d-flex rounded-4 p-4 pt-2 pb-2 ms-auto"
                    style={{
                      backgroundColor: "rgba(31, 152, 189, 0.17)",
                      color:'rgb(49, 67, 186)',
                      maxWidth: "97vh",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      fontFamily: "corbel",fontSize:'14px' 
                    }}
                  >
                    {item.question}
                  </div>
                </div>
                {/* Answer */}
                {item.answer && (
                  <div
                    className="d-flex flex-row w-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div
                      class="d-flex "
                      style={{ backgroundColor: "white", maxHeight: "40px" }}
                    >
                      <img
                        src="pp.png"
                        alt="chatbot Icon"
                        className=""
                        style={{ width: "40px", height: "auto" }}
                      />
                    </div>
                    
                    <div
                      className="d-flex rounded-4 p-4 pt-2 pb-2 ms-3"
                      style={{
                        backgroundColor: " white",fontSize:'16px' ,

                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                        color: "black",
                        fontFamily: "corbel",
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                )}

                {/* Dummy div to maintain scroll position */}
                <div ref={conversationEndRef}></div>
              </div>
            ))}

            {/*-----------------------------------------------------------------------------*/}
          </div>

          {/* Footer */}

          <div class="w-100 mt-5 mt-auto">
            {/* text input */}
            <div className="d-flex flex-colomn rounded-4 shadow-lg p-4 w-100">
              <textarea
                style={{
                  backgroundColor: "withe",
                  fontFamily: "corbel",
                  fontSize: "17px",
                }}
                placeholder="Exprimez ce que vous souhaitez récupérer de la base de données..."
                rows="2"
                value={question} // Binding textarea value to state
                onChange={handleQuestionChange} // Handle input change
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Prevent newline insertion
                      handleSubmitQuestion(); // Trigger the submit function
                    }}}
              ></textarea>

              {/*submit question btn*/}
              <button
                className="btn justify-content-center align-items-center rounded-3 ms-2"
                style={{ backgroundColor: "rgba(195, 179, 35, 0.21)" }}
                onClick={handleSubmitQuestion}
              >
                <i
                  className="fa-solid fa-arrow-up"
                  style={{ width: "20px" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
