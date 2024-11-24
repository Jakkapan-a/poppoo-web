import {Link, useNavigate} from "react-router-dom";


export default function About() {


    return (
        <>
            <div className="container mt-4 d-flex justify-content-center align-items-center mt-4">
                <div className="card text-center w-100 p-3">
                    <h5 className="card-title">เกี่ยวกับฉัน</h5>
                    <div className="card-body text-center m-0">
                        <p className="card-text">
                            เป็นแอปพลิเคชันที่ถูกสร้างขึ้นเพื่อเป็นตัวอย่างการ ออกแบบ ระบบเว็บที่มีการ update ข้อมูลแบบ real-time มีระบบ login จัดอันดับ score แบบ real-time                        </p>

                        <h5 className="card-title">ดูรายละเอียดเพิ่มเติมได้ที่ GITHUB</h5>
                        <a href="https://github.com/Jakkapan-a/poppoo-web" className="btn btn-primary">
                            GITHUB
                        </a>
                    </div>
                </div>
            </div>


        </>
    )
}
