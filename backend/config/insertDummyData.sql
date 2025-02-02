/*Dummy data for database*/
INSERT INTO Locations (name, latitude, longitude, website, createdAt, updatedAt) VALUES
('The Velvet Room', 40.7128, -74.0060, 'https://velvetroom.com', date(), date()),
('Bassline Club', 34.0522, -118.2437, 'https://basslineclub.com', date(), date()),
('Harmony Hall', 41.8781, -87.6298, 'https://harmonyhall.com', date(), date()),
('Echo Lounge', 29.7604, -95.3698, 'https://echolounge.com', date(), date()),
('The Vortex', 51.5074, -0.1278, 'https://vortexlondon.com', date(), date()),
('Crescendo Space', 48.8566, 2.3522, 'https://crescendoparis.com', date(), date()),
('Soundwave Arena', 52.5200, 13.4050, 'https://soundwavearena.com', date(), date()),
('Pulse Studios', 37.7749, -122.4194, 'https://pulsestudios.com', date(), date()),
('Aurora Venue', 45.5017, -73.5673, 'https://auroravenue.com', date(), date()),
('Nebula Loft', 33.7490, -84.3880, 'https://nebulaloft.com', date(), date()),
('Lunar Club', 39.7392, -104.9903, 'https://lunarclub.com', date(), date()),
('The Nexus', 47.6062, -122.3321, 'https://thenexus.com', date(), date()),
('Fusion Grounds', 32.7767, -96.7970, 'https://fusiongrounds.com', date(), date()),
('Radiance Stage', 43.6511, -79.3470, 'https://radiancestage.com', date(), date()),
('Tempo Terrace', 31.2304, 121.4737, 'https://tempoterrace.com', date(), date()),
('The Observatory', 40.4168, -3.7038, 'https://theobservatory.com', date(), date()),
('Altitude Hall', 35.6895, 139.6917, 'https://altitudehall.com', date(), date()),
('Cosmic Beats', 55.7558, 37.6173, 'https://cosmicbeats.com', date(), date()),
('Rhythm Tower', 28.6139, 77.2090, 'https://rhythmtower.com', date(), date()),
('Club Nova', 41.9028, 12.4964, 'https://clubnova.com', date(), date());

INSERT INTO Tags (name, createdAt, updatedAt) VALUES
('Electronic', date(), date()),
('Jazz', date(), date()),
('Hip-Hop', date(), date()),
('Workshop', date(), date()),
('Techno', date(), date()),
('Acoustic', date(), date()),
('House', date(), date()),
('Folk', date(), date()),
('Dance', date(), date()),
('Pop', date(), date()),
('Indie', date(), date()),
('Rock', date(), date()),
('Classical', date(), date()),
('Soul', date(), date()),
('Ambient', date(), date());

-- Insert Events (30 events)
INSERT INTO Events (id, name, date, description, locationId, createdAt, updatedAt) VALUES
(1, 'Deep Beats Night', '2025-02-05 20:00:00', 'An immersive night of techno and electronic music.', 1, date(), date()),
(2, 'Jazz Vibes Evening', '2025-02-06 19:30:00', 'Relax and unwind with smooth jazz performances.', 2, date(), date()),
(3, 'Hip-Hop Showcase', '2025-02-07 21:00:00', 'Showcasing the best local and international hip-hop talent.', 3, date(), date()),
(4, 'Techno Underground', '2025-02-08 22:00:00', 'Dive into the depths of the underground techno scene.', 4, date(), date()),
(5, 'Acoustic Sessions', '2025-02-09 18:00:00', 'Intimate acoustic performances from top artists.', 5, date(), date()),
(6, 'Dance Revolution', '2025-02-10 20:00:00', 'Get ready to move with the best dance music.', 6, date(), date()),
(7, 'Rock Revival', '2025-02-11 20:30:00', 'A tribute to rock legends with electrifying performances.', 7, date(), date()),
(8, 'Folk Night', '2025-02-12 18:30:00', 'An evening of soulful folk music.', 8, date(), date()),
(9, 'Soulful Sounds', '2025-02-13 19:00:00', 'Captivating soul music to soothe your soul.', 9, date(), date()),
(10, 'Electronic Escapade', '2025-02-14 22:30:00', 'High-energy electronic music experience.', 10, date(), date()),
(11, 'Indie Tunes', '2025-02-15 19:30:00', 'Exploring the best indie music around.', 11, date(), date()),
(12, 'Pop Parade', '2025-02-16 20:00:00', 'Pop hits performed by amazing artists.', 12, date(), date()),
(13, 'Classical Evening', '2025-02-17 18:00:00', 'A night of timeless classical music.', 13, date(), date()),
(14, 'Ambient Atmosphere', '2025-02-18 21:00:00', 'Chill with ambient soundscapes and vibes.', 14, date(), date()),
(15, 'Cosmic Techno', '2025-02-19 22:00:00', 'Out-of-this-world techno music experience.', 15, date(), date()),
(16, 'Fusion Beats', '2025-02-20 20:00:00', 'A unique mix of electronic and live music.', 16, date(), date()),
(17, 'Lunar Sounds', '2025-02-21 18:30:00', 'A serene evening of soul and jazz.', 17, date(), date()),
(18, 'Rhythm Explosion', '2025-02-22 21:00:00', 'An energetic night of dance and rhythm.', 18, date(), date()),
(19, 'Tempo Tunes', '2025-02-23 20:00:00', 'A mix of house and electronic beats.', 19, date(), date()),
(20, 'Club Beats Night', '2025-02-24 22:00:00', 'The best club music to keep you moving.', 20, date(), date()),
(21, 'Jazz Fusion', '2025-02-25 19:00:00', 'A fusion of jazz and contemporary sounds.', 1, date(), date()),
(22, 'Rock Legends Tribute', '2025-02-26 20:30:00', 'Celebrating the greatest rock bands of all time.', 2, date(), date()),
(23, 'Hip-Hop Cypher', '2025-02-27 21:00:00', 'An open mic cypher for hip-hop enthusiasts.', 3, date(), date()),
(24, 'Workshop on Music Production', '2025-02-28 17:00:00', 'Learn the art of music production.', 4, date(), date()),
(25, 'Soul Sessions', '2025-03-01 19:30:00', 'A soulful evening with live performances.', 5, date(), date()),
(26, 'Electronic Bliss', '2025-03-02 22:00:00', 'Lose yourself in electronic soundscapes.', 6, date(), date()),
(27, 'Folk Fest', '2025-03-03 18:00:00', 'A festival celebrating folk music.', 7, date(), date()),
(28, 'Classical Gala', '2025-03-04 18:30:00', 'A grand night of classical masterpieces.', 8, date(), date()),
(29, 'Ambient Escape', '2025-03-05 20:00:00', 'Relax with ambient music and visuals.', 9, date(), date()),
(30, 'Pop Spectacle', '2025-03-06 20:30:00', 'A night of stunning pop performances.', 10, date(), date());

-- Insert Event_Tags (associating events with tags)
INSERT INTO Event_Tags (EventId, TagId, createdAt, updatedAt) VALUES
(1, 5, date(), date()), (1, 10, date(), date()), (1, 1, date(), date()), -- Deep Beats Night: Techno, Pop, Electronic
(2, 2, date(), date()), (2, 14, date(), date()), (2, 6, date(), date()), -- Jazz Vibes Evening: Jazz, Soul, Acoustic
(3, 3, date(), date()), (3, 9, date(), date()), (3, 7, date(), date()), -- Hip-Hop Showcase: Hip-Hop, Dance, House
(4, 5, date(), date()), (4, 1, date(), date()), (4, 15, date(), date()), -- Techno Underground: Techno, Electronic, Ambient
(5, 6, date(), date()), (5, 8, date(), date()), (5, 2, date(), date()), -- Acoustic Sessions: Acoustic, Folk, Jazz
(6, 9, date(), date()), (6, 10, date(), date()), (6, 1, date(), date()), -- Dance Revolution: Dance, Pop, Electronic
(7, 12, date(), date()), (7, 11, date(), date()), (7, 7, date(), date()), -- Rock Revival: Rock, Indie, House
(8, 8, date(), date()), (8, 6, date(), date()), (8, 14, date(), date()), -- Folk Night: Folk, Acoustic, Soul
(9, 14, date(), date()), (9, 15, date(), date()), (9, 10, date(), date()), -- Soulful Sounds: Soul, Ambient, Pop
(10, 1, date(), date()), (10, 5, date(), date()), (10, 9, date(), date()), -- Electronic Escapade: Electronic, Techno, Dance
(11, 11, date(), date()), (11, 7, date(), date()), (11, 15, date(), date()), -- Indie Tunes: Indie, House, Ambient
(12, 10, date(), date()), (12, 9, date(), date()), (12, 6, date(), date()), -- Pop Parade: Pop, Dance, Acoustic
(13, 13, date(), date()), (13, 2, date(), date()), (13, 15, date(), date()), -- Classical Evening: Classical, Jazz, Ambient
(14, 15, date(), date()), (14, 8, date(), date()), (14, 1, date(), date()), -- Ambient Atmosphere: Ambient, Folk, Electronic
(15, 5, date(), date()), (15, 1, date(), date()), (15, 7, date(), date()), -- Cosmic Techno: Techno, Electronic, House
(16, 1, date(), date()), (16, 9, date(), date()), (16, 10, date(), date()), -- Fusion Beats: Electronic, Dance, Pop
(17, 14, date(), date()), (17, 2, date(), date()), (17, 6, date(), date()), -- Lunar Sounds: Soul, Jazz, Acoustic
(18, 9, date(), date()), (18, 10, date(), date()), (18, 5, date(), date()), -- Rhythm Explosion: Dance, Pop, Techno
(19, 7, date(), date()), (19, 1, date(), date()), (19, 13, date(), date()), -- Tempo Tunes: House, Electronic, Classical
(20, 1, date(), date()), (20, 9, date(), date()), (20, 5, date(), date()), -- Club Beats Night: Electronic, Dance, Techno
(21, 2, date(), date()), (21, 11, date(), date()), (21, 6, date(), date()), -- Jazz Fusion: Jazz, Indie, Acoustic
(22, 12, date(), date()), (22, 7, date(), date()), (22, 2, date(), date()), -- Rock Legends Tribute: Rock, House, Jazz
(23, 3, date(), date()), (23, 9, date(), date()), (23, 10, date(), date()), -- Hip-Hop Cypher: Hip-Hop, Dance, Pop
(24, 4, date(), date()), (24, 5, date(), date()), (24, 6, date(), date()), -- Workshop on Music Production: Workshop, Techno, Acoustic
(25, 14, date(), date()), (25, 15, date(), date()), (25, 2, date(), date()), -- Soul Sessions: Soul, Ambient, Jazz
(26, 1, date(), date()), (26, 5, date(), date()), (26, 9, date(), date()), -- Electronic Bliss: Electronic, Techno, Dance
(27, 8, date(), date()), (27, 6, date(), date()), (27, 2, date(), date()), -- Folk Fest: Folk, Acoustic, Jazz
(28, 13, date(), date()), (28, 2, date(), date()), (28, 15, date(), date()), -- Classical Gala: Classical, Jazz, Ambient
(29, 15, date(), date()), (29, 8, date(), date()), (29, 1, date(), date()), -- Ambient Escape: Ambient, Folk, Electronic
(30, 10, date(), date()), (30, 11, date(), date()), (30, 7, date(), date()); -- Pop Spectacle: Pop, Indie, House