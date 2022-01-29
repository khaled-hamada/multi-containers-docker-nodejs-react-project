import { useState, useEffect } from "react";
import axios from 'axios';

const Fib = () => {
    const [values, setValues] = useState({});
    const [seenIndexes, setSeenIndexes] = useState([]);
    const [index, setIndex] = useState('');
    const [apiResponse, setResponse] = useState('');
    const fetchValues = async () => {
        const values = await axios.get('/api/values/current');
        setValues( values.data);
    };

    const fetchIndexes = async () =>{
        const indexes = await axios.get('/api/values/all');
        setSeenIndexes(indexes.data);
    };

    useEffect(()=>{
        fetchValues();
        fetchIndexes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[apiResponse]);

    const renderSeenIndexes = () =>{
        return seenIndexes.map(({number}) => number).join(', ');
    };

    const renderCalculatedValues = () =>{
        const entries =[];
        for(let key in values ){
            // console.log(key);
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            );
        }
        // console.log(entries)
        return entries;
    };
    const handleSubmit = async (event) =>{
        event.preventDefault();
        const response = await axios.post('/api/values',{
            index: index,
        });
        setIndex('');
        setResponse(response.data);
    };
    return ( 
        <div>
            
            <form onSubmit={handleSubmit}>
                <label> Enter your index: </label>
                <input 
                    value= {index}
                    onChange ={
                        (e) => {
                            const value = e.target.value.match(/\d*/ig)[0];
                            // console.log(value);
                            setIndex(value)
                        }
                    }
                />
                <button type="submit"> Submit</button>
            </form>
            
            <h3>Indexes I have seen: </h3>
            <br />
            {
                renderSeenIndexes()
            }
            
            <h3>Calculated Values: </h3>
            <br />
            {
                renderCalculatedValues()
            }
        </div>
     );
}
 
export default Fib;