import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"



export default function Htrans(){
    const [history, setHistory] = useState()
    const [total, setTotal] = useState()
    const {register, handleSubmit} = useForm();

    const fetchHtrans = async () =>{
        let temp = await axios.get(`http://localhost:3069/api/get`)
        setHistory(temp.data.htrans)
    }
    const fetchTotal = async () =>{
        let tempTotal = await axios.get('http://localhost:3069/api/total')
        setTotal(tempTotal.data.subtotal)

    }
    const changeDate = async (date) =>{
        console.log(date);
        let queryDate = await axios.get(`http://localhost:3069/api/get/${date}`)
        let queryDateSub = await axios.get(`http://localhost:3069/api/total/${date}`)
        setHistory(queryDate.data.htrans)
        setTotal(queryDateSub.data.subtotal)

    }
    useEffect(()=>{
        fetchHtrans()
        fetchTotal();
    },[])
    return(
        <>
            <div className="w-4/6 mx-auto text-zinc-200 bg-zinc-800">
                <h1 className="text-zinc-200 text-2xl font-medium">History Transaksi</h1> <br />
                <div className='flex'>
                    <input type="date" name="" id="" onChange={(e)=>changeDate(e.target.value)} className='bg-zinc-700 p-1.5 rounded-md' />
                   
                    

                </div>

                <br />

                {
                    history ? 
                    <>
                        <h1 className='text-xl'>Hasil penghasilan : Rp. {total ? total : '-'}</h1><br />
                        <table>
                            <tr>
                                <td className='p-2 border'>ID</td>
                                <td className='p-2 border'>Customer</td>
                                <td className='p-2 border'>Menu</td>
                                <td className='p-2 border'>Jumlah</td>
                                <td className='p-2 border'>Subtotal</td>
                            </tr>

                            {
                                history.map((element, key)=>{
                                    return (
                                        <>
                                            <tr key={key}>
                                                <td className='p-2 border'>{element.id}</td>
                                                <td className='p-2 border'>{element.nama}</td>
                                                <td className='p-2 border'>{element.menu}</td>
                                                <td className='p-2 border'>{element.jumlah}</td>
                                                <td className='p-2 border'>Rp.{element.subtotal}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </table>
                    </>
                    :
                    <><h1>Loading . . .</h1></>
                }
                
            </div>  
        </>
    )
}