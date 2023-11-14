import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Htrans(){
    const [history, setHistory] = useState()
    const fetchHtrans = async () =>{
        let temp = await axios.get(`http://localhost:3069/api/get`)
        setHistory(temp.data.htrans)
    }

    useEffect(()=>{
        fetchHtrans()
    },[])
    return(
        <>
            <div className="w-4/6 mx-auto text-zinc-200">
                <h1 className="text-zinc-200 text-2xl font-medium">History Transaksi</h1>
                <br />

                {
                    history ? 
                    <>
                    {console.log(history)}
                        <table>
                            <tr>
                                <td className='p-2 border'>ID</td>
                                <td className='p-2 border'>Customer</td>
                                <td className='p-2 border'>Menu</td>
                                <td className='p-2 border'>Jumlah</td>
                                <td className='p-2 border'>Subtotal</td>
                            </tr>

                            {
                                history.map((element)=>{
                                    return (
                                        <>
                                            <tr>
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