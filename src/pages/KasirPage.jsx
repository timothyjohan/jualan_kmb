import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from 'axios'



export default function KasirPage(){
    const [subtotal, setSubtotal] = useState()
    const [jumlah, setJumlah] = useState(0)
    const [menu, setMenu] = useState()
    const {register, handleSubmit} = useForm();
    let tempSelect
    let tempHarga
    const handleChange = (val)=>{
        
        if(val > 0){
            if(menu == "telur_gulung"){
                tempHarga = 1000*val
            }else if(menu == "es_teh"){
                tempHarga = 2000*val
            }else if(menu == "es_teh_refill"){
                tempHarga = 1000*val
            }else if(menu == "corn_dog_s"){
                tempHarga = 5000*val
            }else if(menu == "corn_dog_m"){
                tempHarga = 12000*val
            }else if(menu == "corn_dog_sm"){
                tempHarga = 10000*val
            }
            
        }else{
            tempHarga = null
        }
        setSubtotal(tempHarga)
        setJumlah(val)
    }


    const insertData = async (nama, menu, jumlah, subtotal) =>{
        console.log(nama, menu, jumlah, subtotal);
        const temp = await axios.post(`http://localhost:3069/api/${nama}/${menu}/${jumlah}/${subtotal}`)
        alert("Pesanan " + nama + " " + menu + " Masuk")

    }
    const submitForm = async (data, e) => {
        let menuString
        if(menu == "telur_gulung"){
            menuString = "Telur Gulung"
        }else if(menu == "es_teh"){
            menuString = "Es Teh"
        }else if(menu == "es_teh_refill"){
            menuString = "Es Teh (Refill)"
        }else if(menu == "corn_dog_s"){
            menuString = "Corn Dog Sosis"
        }else if(menu == "corn_dog_m"){
            menuString = "Corn Dog Mozzarella"
        }else if(menu == "corn_dog_sm"){
            menuString = "Corn Dog Sosis Mozzarella"
        }
        await insertData(data.nama, menuString, jumlah, subtotal)
        setSubtotal()
        e.target.reset()
    }
    
    

    return(
        <>
            <div className="w-4/6 mx-auto">
                <h1 className="text-zinc-200 text-2xl font-medium">Kasir</h1>
                <div className="bg-zinc-600 p-10 w-5/6 mx-auto my-10 rounded-md">
                    <form onSubmit={handleSubmit(submitForm)}>
                        <div className="flex justify-center items-center my-10">
                            <input type="text" name="nama" id="nama" placeholder="Nama Customer" {...register("nama")} required className="text-white bg-zinc-700 p-2 rounded-md w-5/6" />
                        </div>
                        <div className="flex justify-center items-center my-10">
                            <select name="" id="" {...register("menu")} defaultValue={"null"} placeholder="Menu" onChange={(e)=>{setMenu(e.target.value)}} required className="text-white bg-zinc-700 p-2 rounded-md w-5/6">
                                <option value="null" disabled>-</option>
                                <option value="telur_gulung">Telur Gulung - Rp.1000</option>
                                <option value="es_teh">Es Teh - Rp.2000</option>
                                <option value="es_teh_refill">Es Teh (Refill) - Rp.1000</option>
                                <option value="corn_dog_s">Corn Dog Sosis - Rp.5000</option>
                                <option value="corn_dog_m" >Corn Dog Mozzarela - Rp.12 000</option>
                                <option value="corn_dog_sm" >Corn Dog Sosis Mozzarela - Rp.10 000</option>
                            </select>
                        </div>
                        <div className="flex justify-center items-center my-10">
                            <input type="number" name="" id="" placeholder="Jumlah" {...register("jumlah")} onChange={(e)=>handleChange(e.target.value)} required className="text-white bg-zinc-700 p-2 rounded-md w-5/6" />
                        </div>

                        <h1 className="text-xl text-zinc-200 text-center">Subtotal : {subtotal ? subtotal : "-"}</h1>
                        <div className="flex justify-center items-center my-10">
                            <button disabled={!subtotal ? true : false } type="submit" className="text-white bg-zinc-700 hover:bg-zinc-500 p-4 w-5/6 rounded-md">Checkout</button>

                        </div>
                    </form>
                </div>
            </div>  
        </>
    )
}