import { Form } from "react-bootstrap";

const AttributesFilterComponent = () => {
   return (
      <>
         {[{ color: ["red", "blue", "green"] }, { ram: ["1 TB", "2 TB"] }].map(
            (item, index) => {
               const [attribute, values] = Object.entries(item)[0];

               return (
                  <div key={index} className="mb-3">
                     <Form.Label>
                        <b>{attribute}</b>
                     </Form.Label>
                     {values.map((value) => (
                        <Form.Check key={value} type="checkbox" label={value} />
                     ))}
                  </div>
               );
            }
         )}
      </>
   );
};

export default AttributesFilterComponent;