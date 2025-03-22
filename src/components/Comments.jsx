import { useEffect, useState, useRef } from 'react';
import { users as usersData } from '@/src/data/users';
import DEFAULT_AVATAR from '@/src/assets/default_profile.png';

// Función para generar un usuario aleatorio
const generateLiveUser = () => {
    const user = usersData[Math.floor(Math.random() * usersData.length)];
    if (!user) {
        return {
            nickname: 'Usuario',
            profile_image: DEFAULT_AVATAR,
            message: 'Mensaje por defecto'
        };
    }
    
    return {
        nickname: user.nickname,
        profile_image: user.profile_image,
        message: user.messages[Math.floor(Math.random() * user.messages.length)]
    };
};

export default function Comments() {

    const [liveUsers, setLiveUsers] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        const addNewUser = () => {
            setLiveUsers((prevUsers) => {
                const newUser = generateLiveUser();
                return [...prevUsers, newUser];
            });
        };

        // Añadir el primer usuario
        addNewUser();

        // Configurar el intervalo
        const interval = setInterval(addNewUser, 5000);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [liveUsers]);

    return (
        <div className="usuarios-activos font p-4 text-white rounded-lg shadow-lg h-full overflow-y-auto scrollbar-hide">
            <ul className="space-y-3">
                {liveUsers.map((user, index) => (
                    <li key={`${user.nickname}-${index}`} className="flex items-center space-x-3 p-2 rounded-lg">
                        <img src={user.profile_image.src} width={40} height={40} alt={`Avatar de ${user.nickname}`} className="rounded-full object-cover w-10 h-10" />
                        <div>
                            <p className="text-2xl">{user.nickname}</p>
                            <p className="text-xl text-white">{user.message}</p>
                        </div>
                    </li>
                ))}
                <div ref={bottomRef} />
            </ul>
        </div>
    );
}
