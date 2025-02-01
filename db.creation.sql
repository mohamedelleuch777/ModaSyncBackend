-- Collections definition
CREATE TABLE Collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SubCollections Table
CREATE TABLE SubCollections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER,
    "name" TEXT,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES Collections(id) ON DELETE CASCADE
);

-- Samples definition
CREATE TABLE Samples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subcollection_id INTEGER,
    isActive TEXT CHECK(isActive IN ('true', 'false')) DEFAULT 'true',
    FOREIGN KEY (subcollection_id) REFERENCES SubCollections(id) ON DELETE CASCADE
);

-- Timeline definition
CREATE TABLE Timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sample_id INTEGER,
    status TEXT CHECK(status IN (
        'new',              
        'in_review',        
        'in_development',   
        'development_done', 
        'external_task',    
        'in_production',    
        'testing',          
        'accepted',         
        'rejected',         
        'readjustment',     
        'cut_phase',        
        'preparing_traces', 
        'ready'             
    )),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sample_id) REFERENCES Samples(id) ON DELETE CASCADE
);

-- Pictures Table
CREATE TABLE Pictures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    sample_id INTEGER,
    image_url TEXT,
    FOREIGN KEY (sample_id) REFERENCES Samples(id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    "password" TEXT,
    role TEXT CHECK(role IN ('Stylist', 'Manager', 'Modelist', 'ExecutiveWorker', 'Tester'))
);

-- Comments Table
CREATE TABLE Comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    picture_id INTEGER,
    commenter INTEGER,
    comment_text TEXT,
    FOREIGN KEY (commenter) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (picture_id) REFERENCES Pictures(id) ON DELETE CASCADE
);

-- External Services Provider Table
CREATE TABLE ExternalServicesProvider (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    phone TEXT UNIQUE,
);