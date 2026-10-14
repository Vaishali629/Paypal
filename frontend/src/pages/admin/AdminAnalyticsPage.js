import { Row, Col, Form } from "react-bootstrap";
import AdminLinksComponent from "../../components/admin/AdminLinksComponent";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
const AdminAnalyticsPage = () => {
       const data = [
        {
          name: "12:00 AM",
          "2026 year": 4000,
          "2025 year": 4100,
        },
         {
          name: "1:00 AM",
          "2026 year": 4200,
          "2025 year": 4300,
        },
        
         {
          name: "2:00 AM",
          "2026 year": 6000,
          "2025 year": 6300,
        },
        
         {
          name: "9:00 AM",
          "2026 year": 6400,
          "2025 year": 7000,
        },
        
         {
          name: "10:00 AM",
          "2026 year": 6800,
          "2025 year": 7200,
        },
        
         {
          name: "10:00 AM",
          "2025 year": 23000,
          
        },
        {
          name: "11:00 PM",
          "2021 year": 23500,
        }
        
  

       ]
  return (
    <Row className="m-5">
       <Col md={2}>
           <AdminLinksComponent />
       </Col>
       <Col md={10}>
          <h1>Black Friday Cumulative Revenue 11/26/2026 VS 11/27/2026</h1>
          <Form.Group controlId="firstDateToCompare">
            <Form.Label>Select First Date To Compare</Form.Label>
            <Form.Control
                type="date"
                name="firstDateToCompare"
                placeholder="First Date To Compare" 
                />
          </Form.Group>
          <br />
           <Form.Group controlId="secondDateToCompare">
            <Form.Label>Select Second Date To Compare</Form.Label>
            <Form.Control
                type="date"
                name="secondDateToCompare"
                placeholder="Second Date To Compare" 
                />
          </Form.Group>
              <ResponsiveContainer width="100%" height={500}>
           <LineChart
               data={data}  
               margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
               }} 
               >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{value: "TIME", offset: 50, position: "insideBottomRight",}} allowDuplicatedCategory={false} />
                <YAxis  label={{value: "REVENUE $", angle: -90, position: "insideLeft" }
                }/>
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                   type="monotone"
                   dataKey="2025 year"
                   stroke="#8884d8"
                   activeDot={{ r: 8 }}
                   strokeWidth={4}
                   />
                   <Line type="monotone" dataKey="2026 year" stroke="#82ca9d" 
                   strokeWidth={4} />

               </LineChart>
              </ResponsiveContainer>
       </Col>
    </Row>
  );
};

export default AdminAnalyticsPage;
