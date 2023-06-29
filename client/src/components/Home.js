import Button from "react-bootstrap/esm/Button"

function Home({ user }) {
    return (

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 style={{ color: "#f8f8f8", marginTop: "5rem", marginBottom: "1rem", fontSize: '85px' }}>Meet HalfWay</h1>
                <h4 style={{ color: "#f8f8f8", marginBottom: "1rem" }}>a solution to planning trips the smart way</h4>
                <i style={{ color: "#f8f8f8", marginTop: "3rem", marginBottom: "3rem", fontSize: '65px' }} class="fa-solid fa-location-crosshairs fa-beat-fade"></i>
                {user ? <Button style={{ fontWeight: "bold" }} variant="success" href={'/create'}>
                    Find my Midpoint
                </Button> : <Button style={{ fontWeight: "bold" }} variant="success" href={"/authentication"}>Login</Button>}
            </div>
        </div>



    )
}

export default Home