import Button from "react-bootstrap/esm/Button"

function Home({ user }) {
    return (

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 className="shadow" style={{ color: "#f8f8f8", marginBottom: "1rem" }}>Meet HalfWay</h1>
                <h4 style={{ color: "#f8f8f8", marginBottom: "1rem" }}>a solution to planning trips the smart way</h4>
                {user ? <Button variant="success" href={'/create'}>Find my Midpoint</Button> : <Button variant="success" href={"/authentication"}>Login</Button>}
            </div>
        </div>



    )
}

export default Home