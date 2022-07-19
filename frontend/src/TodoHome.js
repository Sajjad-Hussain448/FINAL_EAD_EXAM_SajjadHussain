import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table';

import {useFormik} from 'formik'
import { useEffect, useState } from "react";
import { BASE_URL } from "./constants";
import {useNavigate} from 'react-router-dom'

function TodoHome() {

  const [image, setImage]=useState(null)
  const [todos, setTodos]=useState()
  const navigate=useNavigate()

  useEffect(()=>{
    fetch(BASE_URL+'/getTodos').then(resp=>resp.json()).then(resp=>{
        if(resp.data){
            console.log(resp.data)
            setTodos(resp.data)
        }
      })
  },[])
    const formik=useFormik({
        initialValues:{
            title:'',
            description:'',
        },
        validate:values=>{
            // console.log(values)
        },
        onSubmit:values=>{
            
          const formData=new FormData()

          formData.append('title', values.title)
          formData.append('description', values.description)
          formData.append('image', image)

          fetch(BASE_URL+'/add',{
            method:'POST',
            headers:{},
            body:formData
          }).then(resp=>resp.json()).then(resp=>{
            if(resp.success){
                console.log(resp.data)
                setTodos(resp.data)
            }
          })
        }
    })

    function handleFile(e){

      setImage(e.target.files[0])
    }

    function deleteTodo(_id){
        
        fetch(BASE_URL+'/delete',{
            method:'DELETE',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({_id})
          }).then(resp=>resp.json()).then(resp=>{
            if(resp.success){
                setTodos(resp.data)
            }
          })
    }

    function updateTodo(todo){
        navigate('/edit-todo', {state:{todo:todo}})
    }
  return (
    <Container className="mt-4 ">
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
        <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Control type="text" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter Book Name" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Control type="text" name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter Book Description" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          {/* <Form.Label>Enter Book Image</Form.Label>
          <Form.Control type="file" placeholder="Select Image" onChange={handleFile} ></Form.Control> */}
           </Form.Group>

        <Button variant="warning" type="submit">
          Add
        </Button>
      </Form>
        </Col>
      </Row>

      <Row className="mt-4">
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Book Name</th>
          <th>Book Description</th>

          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
            todos?todos.map((todo, index)=>{
                return(
                    <tr>
                        <td>{index+1}</td>
                        <td>{todo.title}</td>
                        <td>{todo.description}</td>
                  
                        <td><Button variant="success" onClick={()=>{deleteTodo(todo._id)}}>Delete</Button></td>

                    </tr>
                )
            }):''
        }
      </tbody>
    </Table>
      </Row>
    </Container>
  );
}

export default TodoHome;
