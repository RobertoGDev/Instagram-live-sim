import { useEffect, useState } from 'react';
import { reactions } from '@/src/data/reactions';

const MAX_REACTIONS = 33; // Número máximo de reacciones visibles
const MIN_INTERVAL = 100; // Reducido de 500ms a 200ms
const MAX_INTERVAL = 200; // Reducido de 1500ms a 800ms
const REACTIONS_PER_BATCH = 1; // Número de reacciones a agregar por intervalo

const generateReaction = () => {
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    return {
        id: Date.now() + Math.random(), // ID único para cada reacción
        icon: reaction.icon.src,
        position: Math.random() * 30 // Guardamos la posición en el objeto
    };
};

export default function SideReactions() {
    const [sideReactions, setReactions] = useState([]);

    useEffect(() => {
        const addReactions = () => {
            setReactions(prevReactions => {
                const newReactions = Array(REACTIONS_PER_BATCH)
                    .fill(null)
                    .map(() => generateReaction());
                
                const updatedReactions = [...prevReactions, ...newReactions];
                
                if (updatedReactions.length > MAX_REACTIONS) {
                    return updatedReactions.slice(-MAX_REACTIONS);
                }
                return updatedReactions;
            });
        };

        // Intervalo aleatorio entre MIN_INTERVAL y MAX_INTERVAL
        const randomInterval = () => Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;
        
        // Añadir reacciones iniciales
        addReactions();

        let timeout;
        const scheduleNextReaction = () => {
            timeout = setTimeout(() => {
                addReactions();
                scheduleNextReaction();
            }, randomInterval());
        };

        setTimeout(() => {	
            scheduleNextReaction();
        }, 1000 + Math.random() * 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="reactions font p-4 text-white rounded-lg shadow-lg h-full overflow-hidden relative">
            <ul className="h-full w-full absolute inset-0">
                {sideReactions.map(reaction => (
                    <span 
                        key={reaction.id}
                        className="reaction absolute flex items-center space-x-3 p-2 rounded-lg animate-float"
                        style={{
                            right: `${reaction.position}px`, // Usamos la posición guardada
                            bottom: '0%'
                        }}
                    >
                        <img 
                            src={reaction.icon}
                            alt="reaction"
                            className="w-8 h-8"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </span>
                ))}
            </ul>
        </div>
    );
}
