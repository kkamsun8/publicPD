import { useState, useEffect } from 'react'

console.log("이전");

const EditProfile = () => {
    const [text, settext] = useState("");
    useEffect(() => {
        console.log("이펙트", text)
        return () => {
            console.log('소멸', text)
        };
    }, [text]);
    console.log("다음");
    return (
        <div>
            EditProFile
            <input type="text" onChange={(e) => settext(e.currentTarget.value)} />
        </div>
    )
}

export default EditProfile
