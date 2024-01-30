import React, { useState, useEffect, useRef } from 'react';
import { socket, connectSocket } from "../socket";
import axios from 'axios';
import "./index.scss";
import AudioCallDialog from "../sections/dashboard/Audio/CallDialog"
import { async } from 'emoji-mart';
import AudioCallNotification from "../sections/dashboard/Audio/CallNotification";
import VideoCallNotification from "../sections/dashboard/video/CallNotification";
import VideoCallDialog from "../sections/dashboard/video/CallDialog";

const host = "http://localhost:3000"
const user_id = "659708ddbb99d01da3ca0a6f";
// "659708ddbb99d01da3ca0a6f";
let token =
"eyJhbGciOiJSUzI1NiIsImtpZCI6IjViNjAyZTBjYTFmNDdhOGViZmQxMTYwNGQ5Y2JmMDZmNGQ0NWY4MmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9sYXItMTQzNDMiLCJhdWQiOiJwb2xhci0xNDM0MyIsImF1dGhfdGltZSI6MTcwNjU4NDE1MiwidXNlcl9pZCI6Ilc3TWlCeVFLcGtlWWlrYXpOMjdDZGF1Z3h0ajIiLCJzdWIiOiJXN01pQnlRS3BrZVlpa2F6TjI3Q2RhdWd4dGoyIiwiaWF0IjoxNzA2NTg0MTUyLCJleHAiOjE3MDY1ODc3NTIsImVtYWlsIjoibjE1MDIzMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsibjE1MDIzMUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.NF32cD6p17oTplKGTXZid97J1P-LXYYtk6Hfoe8NTnYQFNcU6hYbAdKunQDa6B4L7nApOmonPgbc-H79k5PzQAY3TlyH6CEyaDj_JCUueTbzDc4iI9BCl9MInUP6D0n6JtSGpjbx6SjY3RJ4juWcSelpuEYr7Q-4T-VUustyQ1ecQxI4bq0qHeu4qeqkJ0ZemYXzfjMSDGRnv7riE2B-R3pCOLX5fCWlguruOdGdkpqhvcto8gHeOMU0AnfCRV5ECi0DEatqw5J3FyK0j7SWL1DHAxB39wMQaEJnVLPY3A46FA4AS8FuR01OJuOIT23rra9H0xgHy8EHeeLKD0Br6w"
// "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQxNjg5NDE1ZWMyM2EzMzdlMmJiYWE1ZTNlNjhiNjZkYzk5MzY4ODQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9sYXItMTQzNDMiLCJhdWQiOiJwb2xhci0xNDM0MyIsImF1dGhfdGltZSI6MTcwNDg4NTMyNCwidXNlcl9pZCI6Ilc3TWlCeVFLcGtlWWlrYXpOMjdDZGF1Z3h0ajIiLCJzdWIiOiJXN01pQnlRS3BrZVlpa2F6TjI3Q2RhdWd4dGoyIiwiaWF0IjoxNzA0ODg1MzI0LCJleHAiOjE3MDQ4ODg5MjQsImVtYWlsIjoibjE1MDIzMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsibjE1MDIzMUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.nMSyeWVt0dqQPDPBge_9PyjFzVvu9YLr6Z0_ik_3VUb6J45HkNpi4KgpzdDVejiRLdThX9lza9DoKJIgwUTQhF7aB28vvRbPSWebupV8H1mfw7RX2gEt4XEBYeapbk3HfG-SsiDvc2JcFwV8-YUuAIwV1t8eYv2ytopMh5jN71rVQpnQB664l9UQCru5Qw6eREdOzcz_SkbR9z-25mFpJZmeTySonbqtY8iX9-s8kNhMDW1cLKoCcgtmZ7za6ygX7p1u3mpcbtK8BCRhbGwhsYS0HRuhsMHjQzJz6L7U7fljxnlEInRFLacK5hjNVRtvQFjGUqhy0B8F4Lt8TlSlGw"
const Test = () => {
    const [friends, setFriends] = useState([]);
    const [user, setUser] = useState({});
    const [message, setMessage] = useState([]);
    const [roomId, setRoomId] = useState(null);
    const [isGroup, setIsGroup] = useState(false);
    const [socketId, setSocketId] = useState("");
    // const [groups, setGroups] = useState([]);

    const handleReceiveMessageRef = useRef();

    const handleReceiveGroupMessageRef = useRef();

    const handleUserConnectedRef = useRef();


    const [directChat, setDirectChat] = useState({
        conversations: [],
        currentConversation: {},
        currentMessages: [],
    });

    const [groupChat, setGroupChat] = useState({
        conversations: [],
        currentConversation: {},
        currentMessages: [],
    });

    //call
    const [audioCall, setAudioCall] = useState(
        {
            open_audio_dialog: false,
            open_audio_notification_dialog: false,
            call_queue: [],
            incoming: false,
        }
    )

    const [videoCall, setVideoCall] = useState(
        {
            open_video_dialog: false,
            open_video_notification_dialog: false,
            call_queue: [],
            incoming: false,
        }
    )


    const pushToAudioCallQueue = (action) => {
        // check audio_call_queue in redux store
        let audio_call_queue_temp = { ...audioCall }
        if (audio_call_queue_temp?.call_queue.length === 0) {
            audio_call_queue_temp = { ...audio_call_queue_temp, call_queue: [...audio_call_queue_temp.call_queue, action?.call] }
            if (action.incoming) {
                audio_call_queue_temp = {
                    ...audio_call_queue_temp,
                    open_audio_notification_dialog: true,
                    incoming: true
                }
            }
            else {
                audio_call_queue_temp = {
                    ...audio_call_queue_temp,
                    open_audio_dialog: true,
                    incoming: false
                }
            }
            setAudioCall(audio_call_queue_temp)
        } else {
            // if queue is not empty then emit user_is_busy => in turn server will send this event to sender of call
            console.log("vara busy", action)

            socket.emit("user_is_busy_audio_call", { ...action });
        }
    }

    const pushToVideoCallQueue = (action) => {
        // check audio_call_queue in redux store
        let video_call_queue_temp = { ...videoCall }
        if (video_call_queue_temp?.call_queue.length === 0) {
            video_call_queue_temp = { ...video_call_queue_temp, call_queue: [...video_call_queue_temp.call_queue, action?.call] }
            if (action.incoming) {
                video_call_queue_temp = {
                    ...video_call_queue_temp,
                    open_video_notification_dialog: true,
                    incoming: true
                }
            }
            else {
                video_call_queue_temp = {
                    ...video_call_queue_temp,
                    open_video_dialog: true,
                    incoming: false
                }
            }
            setVideoCall(video_call_queue_temp)
        } else {
            // if queue is not empty then emit user_is_busy => in turn server will send this event to sender of call
            console.log("vara busy", action)

            socket.emit("user_is_busy_audio_call", { ...action });
        }
    }


    useEffect(() => {
        console.log("socket", socket);
        if (!socket) {
            connectSocket(user_id);
        } else {
            console.log("else socket", socket?.connected);
            // getFriends();
            // getUser();
            // getGroups();
            socket.emit("get_direct_conversations", { user_id }, (data) => {
                console.log("event emited");
                getConversations(data);
            });

            socket.emit("get_group_conversations", { user_id }, (data) => {
                getGroupConversations(data);
            });

            socket.on("audio_call_notification", (data) => {
                // TODO => dispatch an action to add this in call_queue
                pushToAudioCallQueue({ call: data });
            });

            socket.on("video_call_notification", (data) => {
                // TODO => dispatch an action to add this in call_queue
                pushToVideoCallQueue({ call: data, incoming: true });
            });

            socket.on("user_connected", (data) => {
                handleUserConnectedRef.current(data);
            });

            // socket.on("start_chat", (data) => {
            //     console.log(data);
            //     //     // add / update to conversation list
            //     const existing_conversation = directChat?.conversations.find(
            //         (el) => el?.id === data._id
            //     );
            //     console.log("existing_conversation", existing_conversation)
            //     if (existing_conversation) {
            //         // update direct conversation
            //         //   dispatch(UpdateDirectConversation({ conversation: data }));
            //     } else {
            //         // add direct conversation
            //         getDirectConversations(data)
            //     }
            //     // dispatch(SelectConversation({ room_id: data._id }));
            // });

            socket.on("new_message", (data) => {
                handleReceiveMessageRef.current(data);
            });

            socket.on("new_group_message", (data) => {
                handleReceiveGroupMessageRef.current(data);
            });

        }
        return () => {
            // socket?.off("start_chat");
            socket?.off("new_message");
            socket?.off("new_group_message");
            socket?.off("audio_call_notification");
            socket?.off("video_call_notification");
        };
    }, [socket])

    const handleNewMessage = (data) => {
        const message = data.message;
        let messages = directChat.currentMessages;
        if (directChat?.currentConversation?.id === data.conversation_id) {
            messages.push({
                id: message._id,
                type: "msg",
                subtype: message.type,
                message: message.text,
                incoming: message.to === user_id,
                outgoing: message.from === user_id,
            })
            setDirectChat({
                ...directChat,
                currentMessages: messages
            });
        }
    }

    const handleNewGroupMessage = (data) => {
        const message = data.message;
        let messages = groupChat.currentMessages;
        if (groupChat?.currentConversation?.id === data.conversation_id) {
            messages.push({
                id: message._id,
                type: "msg",
                subtype: message.type,
                message: message.text,
                incoming: message.to === user_id,
                outgoing: message.from === user_id,
            })
            setGroupChat({
                ...groupChat,
                currentMessages: messages
            });
        }
    }

    const handleUserConnected = ({ socketId }) => {
        setSocketId(socketId)
    }

    handleReceiveMessageRef.current = handleNewMessage
    handleReceiveGroupMessageRef.current = handleNewGroupMessage
    handleReceiveMessageRef.current = handleNewMessage

    handleUserConnectedRef.current = handleUserConnected;



    const getConversations = (conversationsData) => {
        const list = conversationsData.map((el) => {
            const user = el.participants.find(
                (elm) => elm._id.toString() !== user_id
            );
            return {
                id: el._id,
                user_id: user?._id,
                name: `${user?.userName}`,
                online: user?.status === "Online",
                //   img: `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`,
                msg: el?.messages?.slice(-1)?.[0]?.text || "",
                time: "9:36",
                unread: 0,
                pinned: false,
                about: user?.about,
            };
        });

        setDirectChat({
            ...directChat,
            conversations: list
        })
    }

    const getGroupConversations = (conversationsData) => {
        const list = conversationsData.map((el) => {
            const user = el.participants.find(
                (elm) => elm._id.toString() !== user_id
            );
            return {
                id: el._id,
                name: `${conversationsData?.[0]?.name}`,
                //   img: `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`,
                msg: el?.messages?.slice(-1)?.[0]?.text || "",
                time: "9:36",
                unread: 0,
                pinned: false,
                about: user?.about,
            };
        });

        setGroupChat({
            ...groupChat,
            conversations: list
        })
    }

    const getDirectConversations = (conversation) => {
        const this_conversation = conversation;
        const user = this_conversation.participants.find(
            (elm) => elm._id.toString() !== user_id
        );
        console.log("user", user)
        let direct_chat = {
            conversations: [],
        }
        direct_chat.conversations = directChat.conversations.filter(
            (el) => el?.id !== this_conversation._id
        );
        console.log("direct_chat", direct_chat)
        direct_chat.conversations.push({
            id: this_conversation._id,
            user_id: user?._id,
            name: `${user?.userName}`,
            online: user?.status === "Online",
            //   img: faker.image.avatar(),
            //   msg: faker.music.songName(),
            time: "9:36",
            unread: 0,
            pinned: false,
        });
        console.log("direct_chat", direct_chat)
    }

    const disconnectUser = () => {
        // socket.emit("end", {user_id});
    }

    // const getToken = async()=>{
    //     let data = {
    //         'email': 'jvvprasad04@gmail.com',
    //         'password': 'abcd1234',
    //         'returnSecureToken': 'true' 
    //       };
    //     await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCqF_Nc3-kzWX8slpNTWmxBbH_dows8zRw",data)
    //     .then(res=>{
    //         console.log(res);
    //         token = res?.idToken;
    //         getFriends();
    //     })
    // }

    // const getFriends = async () => {
    //     await axios
    //         .get(
    //             host + "/user/getFriends",
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             setFriends(response?.data?.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    //while clicking on friends
    const startConversation = (id) => {
        socket.emit("start_conversation", { to: id, from: user_id });
    }

    const selectConversation = (conversationId) => {
        let room_id = conversationId;
        setIsGroup(false);
        setRoomId(room_id)
        const current = directChat?.conversations.find((el) => el?.id === room_id);
        socket.emit("get_messages", { conversation_id: current?.id }, (messages) => {
            const formatted_messages = messages?.map((el) => ({
                id: el._id,
                type: "msg",
                subtype: el.type,
                message: el.text,
                incoming: el.to === user_id,
                outgoing: el.from === user_id,
            }));
            setDirectChat({
                ...directChat,
                currentMessages: formatted_messages || [],
                currentConversation: current
            })
        });
    }


    const selectGroupConversation = (conversationId) => {
        let room_id = conversationId;
        setRoomId(room_id)
        setIsGroup(true);
        const current = groupChat?.conversations.find((el) => el?.id === room_id);
        socket.emit("get_group_messages", { conversation_id: current?.id }, (messages) => {
            const formatted_messages = messages?.map((el) => ({
                id: el._id,
                type: "msg",
                subtype: el.type,
                message: el.text,
                incoming: el.to === user_id,
                outgoing: el.from === user_id,
            }));
            setGroupChat({
                ...groupChat,
                currentMessages: formatted_messages || [],
                currentConversation: current
            })
        });
    }

    const handleAudioCall = async (userId) => {
        let audio_call_queue_temp = { ...audioCall }
        audio_call_queue_temp = {
            ...audio_call_queue_temp,
            call_queue: [],
            open_audio_notification_dialog: false,
            incoming: false
        }
        setAudioCall(audio_call_queue_temp);
        await axios
            .post(
                "http://localhost:3000/user/start-audio-call",
                { id: userId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                pushToAudioCallQueue({
                    call: response.data.data,
                    incoming: false,
                    to: userId,
                    from: user_id
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleVideoCall = async (userId) => {
        let video_call_queue_temp = { ...videoCall }
        video_call_queue_temp = {
            ...video_call_queue_temp,
            call_queue: [],
            open_video_notification_dialog: false,
            incoming: false
        }
        setVideoCall(video_call_queue_temp);
        await axios
            .post(
                "http://localhost:3000/user/start-video-call",
                { id: userId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                pushToVideoCallQueue({
                    call: response.data.data,
                    incoming: false,
                    to: userId,
                    from: user_id
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleCloseAudioDialog = () => {
        let audio_call_queue_temp = { ...audioCall }
        audio_call_queue_temp = {
            ...audio_call_queue_temp,
            call_queue: [],
            open_audio_notification_dialog: false,
            open_audio_dialog: false
        }
        setAudioCall(audio_call_queue_temp)
    };

    const getUser = async () => {
        await axios
            .get(
                "http://localhost:3000/user/getUserProfile",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                setUser(response?.data?.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const createGroup = async () => {
        let groupName = prompt("Enter group Name");
        let email = prompt("Enter a email to add to group");
        await axios
            .post(
                "http://localhost:3000/group/createGroup",
                { participants: [email], groupName },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log("varaprasad", response);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getGroups = async () => {
        await axios
            .get(
                "http://localhost:3000/group/getGroups",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                // setGroups(response?.data?.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const sendMessage = () => {
        console.log("dir", groupChat)
        if (isGroup) {
            socket.emit("group_text_message", {
                message: message,
                conversation_id: roomId,
                from: user_id,
                // to: groupChat?.currentConversation?.user_id,
                type: "Text",
            });
        } else {
            socket.emit("text_message", {
                message: message,
                conversation_id: roomId,
                from: user_id,
                to: directChat?.currentConversation?.user_id,
                type: "Text",
            });
        }
        setMessage("");
    }

    const handleAudioClose = () => {
        let audio_call_queue_temp = { ...audioCall }
        audio_call_queue_temp = {
            ...audio_call_queue_temp,
            open_audio_notification_dialog: false,
            open_audio_dialog: false,
            incoming: false,
            call_queue: []
        }
        setAudioCall(audio_call_queue_temp)
    }

    const handleVideoClose = () => {
        let video_call_queue_temp = { ...videoCall }
        video_call_queue_temp = {
            ...video_call_queue_temp,
            open_video_notification_dialog: false,
            open_video_dialog: false,
            incoming: false,
            call_queue: []
        }
        setVideoCall(video_call_queue_temp)
    }

    const updateAudioCallDialog = (state) => {
        let audio_call_queue_temp = { ...audioCall }
        audio_call_queue_temp = {
            ...audio_call_queue_temp,
            open_audio_notification_dialog: false,
            open_audio_dialog: state
        }
        setAudioCall(audio_call_queue_temp)
    }

    const updateVideoCallDialog = (state) => {
        let video_call_queue_temp = { ...videoCall }
        video_call_queue_temp = {
            ...video_call_queue_temp,
            open_video_notification_dialog: false,
            open_video_dialog: state
        }
        setVideoCall(video_call_queue_temp)
    }
    return (
        <>
            <button onClick={() => {
                socket.emit("end", { user_id });
            }}>logout</button>
            <div>
                {user?.email}
            </div>
            <div className={"container"}>
                <div className={"friend-container"}>
                    <div className='group-container'>
                        <div className='group-header'>
                            <div>Groups</div>
                            <button onClick={() => createGroup()}>Create Group</button>
                        </div>
                        <div>
                            {
                                groupChat?.conversations?.map((groupConversation, index) => {
                                    return (
                                        <div key={index} className={"friend-div"} onClick={() => selectGroupConversation(groupConversation?.id)}>
                                            {groupConversation?.name}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <div className='group-header'>
                            <div>Friends</div>
                            {/* <button onClick={()=>createGroup()}>Create Group</button> */}
                        </div>
                        <div>
                            {
                                directChat?.conversations?.map((conversation, index) => {
                                    return (
                                        <div key={index} className={"friend-div"} onClick={() => selectConversation(conversation?.id)}>
                                            {conversation?.name} <span className='status'>{conversation?.online == true ? "online" : "offline"}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={"chat-container"}>
                    <div className='chat-message'>
                        {
                            isGroup ?
                                groupChat?.currentMessages?.map((message, index) => {
                                    return (
                                        <div key={index} className={message?.outgoing ? "sender" : "receiver"}>{message?.message}</div>
                                    )
                                })
                                :
                                directChat?.currentMessages?.map((message, index) => {
                                    return (
                                        <div key={index} className={message?.incoming ? "receiver" : "sender"}>{message?.message}</div>
                                    )
                                })
                        }

                    </div>
                    <div className={"chat-input"}>
                        <input type={"text"} value={message} placeholder={"Enter text"} onChange={(event) => setMessage(event.target.value)} />
                        <button
                            onClick={() => sendMessage()}
                        >Send</button>
                        <button
                            onClick={() => handleAudioCall(directChat?.currentConversation?.user_id)}
                        >audio call</button>
                        <button
                            onClick={() => handleVideoCall(directChat?.currentConversation?.user_id)}
                        >video call</button>
                    </div>
                </div>
            </div>
            {audioCall?.open_audio_notification_dialog && (
                <AudioCallNotification
                    open={audioCall?.open_audio_notification_dialog}
                    call_details={audioCall.call_queue?.[0]}
                    handleClose={handleAudioClose}
                    updateAudioCallDialog={updateAudioCallDialog}
                />
            )}
            {audioCall?.open_audio_dialog && (
                <AudioCallDialog
                    open={audioCall.open_audio_dialog}
                    handleClose={handleCloseAudioDialog}
                    user={{}}
                    call_details={audioCall.call_queue?.[0]}
                    incoming={audioCall.incoming}
                    token={token}
                    reset={handleAudioClose}
                />
            )}
            {videoCall?.open_video_notification_dialog && (
                <VideoCallNotification
                    open={videoCall?.open_video_notification_dialog}
                    call_details={videoCall.call_queue?.[0]}
                    handleClose={handleVideoClose}
                    updateVideoCallDialog={updateVideoCallDialog}
                />
            )}
            {videoCall?.open_video_dialog && (
                <VideoCallDialog
                    open={videoCall?.open_video_dialog}
                    incoming={videoCall?.incoming}
                    call_details={videoCall.call_queue?.[0]}
                    token={token}
                    handleClose={handleVideoClose}
                    reset={handleVideoClose}
                />
            )}
        </>
    )
}

export default Test;