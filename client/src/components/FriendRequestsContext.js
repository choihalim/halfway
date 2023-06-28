import React, { createContext, useState, useEffect } from 'react'

export const FriendRequestsContext = createContext([])

export const FriendRequestsProvider = ({ user, children }) => {
    const [friendRequests, setFriendRequests] = useState([])

    const user_id = user.id

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    function fetchFriendRequests() {
        fetch(`/friend-requests/received/${user_id}`)
            .then(r => r.json())
            .then(data => {
                setFriendRequests(data)
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return (
        <FriendRequestsContext.Provider value={[friendRequests, setFriendRequests]}>
            {children}
        </FriendRequestsContext.Provider>
    );
};
