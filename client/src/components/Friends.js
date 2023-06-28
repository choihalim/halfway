import { useState, useEffect, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../friends.css';
import { FriendRequestsContext } from './FriendRequestsContext'

function Friends({ user }) {
    const [username, setUsername] = useState('')
    const [friendRequests, setFriendRequests] = useContext(FriendRequestsContext)
    const [friendsList, setFriendsList] = useState([])
    const [activeTab, setActiveTab] = useState('add')
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    const user_id = user.id;

    useEffect(() => {
        if (activeTab === "list") {
            fetchFriendsList();
        }
    }, [activeTab]);

    function acceptFriendRequest(id) {
        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({ friend_request_id: id }),
        }
        fetch(`/friend-requests/accept/${user_id}`, postRequest)
            .then(r => r.json())
            .then(console.log)
    }

    function denyFriendRequest(id) {
        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({ friend_request_id: id }),
        }
        fetch(`/friend-requests/deny/${user_id}`, postRequest)
            .then(r => r.json())
            .then(console.log)
    }

    function fetchFriendsList() {
        fetch(`/friends/${user_id}`)
            .then(r => r.json())
            .then(setFriendsList)
    }

    function requestFriend() {
        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({ friend_username: username }),
        };

        fetch(`/befriend/${user_id}`, postRequest)
            .then((response) => {
                if (response.ok) {
                    setModalMessage('Friend request successfully sent');
                } else if (response.status === 409) {
                    setModalMessage('You may have already sent this request or the friendship already exists.');
                } else if (response.status === 404) {
                    setModalMessage('Please check that the username exists.');
                } else {
                    throw new Error(`Request failed with status code ${response.status}`);
                }
                setShowModal(true);
                setUsername('');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        requestFriend();
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAccept = (id) => {
        acceptFriendRequest(id)
        const updatedFR = friendRequests.filter(request => request.id !== id)
        setFriendRequests(updatedFR)
    }

    const handleDeny = (id) => {
        denyFriendRequest(id)
        const updatedFR = friendRequests.filter(request => request.id !== id)
        setFriendRequests(updatedFR)
    }

    useEffect(() => {
        let timer;
        if (showModal) {
            timer = setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [showModal]);

    return (
        <div className="d-flex justify-content-center">
            <div className="container">
                <Card bg="dark" text="light" style={{ maxWidth: '400px', height: '400px', margin: '0 auto', marginTop: '30px' }}>
                    <Card.Header>
                    </Card.Header>
                    <div style={{ display: 'block', width: '400px', padding: 25 }}>
                        <Tabs
                            defaultActiveKey="add"
                            className='custom-tabs'
                            activeKey={activeTab}
                            onSelect={(tab) => setActiveTab(tab)}
                        >
                            <Tab eventKey="add" title="Add Friend">
                                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Enter Friend's Username
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button variant="success" type="submit">
                                        Add Friend
                                    </Button>
                                </form>
                            </Tab>
                            <Tab eventKey="list" title="Friends List">
                                <div style={{ marginTop: '20px' }}>
                                    {friendsList.length > 0 ? (
                                        friendsList.map((friend) => (
                                            <div key={friend.id}>
                                                <div>{friend.username}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No friends found...</div>
                                    )}
                                </div>
                            </Tab>
                            <Tab
                                eventKey="requests"
                                title={
                                    friendRequests.length > 0 ? (
                                        <>
                                            Requests
                                            <sup>
                                                <span className="badge badge-warning badge-circle" style={{ background: "red", color: 'white', width: '12px', height: '12px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                                    {friendRequests.length}
                                                </span>
                                            </sup>
                                        </>
                                    ) : (
                                        "Requests"
                                    )
                                }
                            >
                                <div style={{ marginTop: '20px', color: 'white' }}>
                                    {friendRequests.length > 0 ? (
                                        friendRequests.map((request) => (
                                            <div key={request.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>{request.username}</div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <Button variant="success" className="mx-2" onClick={() => handleAccept(request.id)}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeny(request.id)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No friend requests...</div>
                                    )}
                                </div>
                            </Tab>

                        </Tabs>
                    </div>
                </Card>

                <Modal show={showModal} onHide={handleCloseModal} centered className={`fade ${showModal ? 'show' : ''}`}>
                    <Modal.Header closeButton className="modal-dark-header">
                        <Modal.Title>Friend Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-dark-body">
                        <p>{modalMessage}</p>
                    </Modal.Body>
                    <Modal.Footer className="modal-dark-footer">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        </div >
    )
}

export default Friends;
