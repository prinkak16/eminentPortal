import React from 'react';

const UserDetails = ({ allowedDeletion, toggleDeletion, utilsService }) => {
    // Placeholder functions, replace them with your actual implementation
    const getName = () => 'John Doe';
    const getEmail = () => 'john@example.com';
    const getPhone = () => '123-456-7890';
    const getRole = () => 'Admin';
    const getCallingRole = () => 'Caller';
    const getCallCenter = () => 'Call Center A';
    const getPermissions = () => [
        { action: 'Read', permission_name: 'View Data' },
        { action: 'Write', permission_name: 'Edit Data' },
    ];
    const allottedCountryStates = [
        { name: 'State A', id: 'SA001' },
        { name: 'State B', id: 'SB002' },
    ];
    const allottedZilas = [
        { name: 'Zila X', id: 'ZX101' },
        { name: 'Zila Y', id: 'ZY102' },
    ];
    const allottedMandals = [
        { name: 'Mandal P', id: 'MP201' },
        { name: 'Mandal Q', id: 'MQ202' },
    ];


    return (
        <div className="container">
            {isStateAdmin && (
                <div className="col">
                    <mat-slide-toggle color="primary" checked={allowedDeletion} onChange={toggleDeletion}>
                        Data Deletion Allowed
                    </mat-slide-toggle>
                </div>
            )}

            {renderCard('Name:', getName())}
            {renderCard('Email:', getEmail())}
            {renderCard('Phone:', getPhone())}
            {renderCard('Role:', getRole())}
            {getCallingRole() !== 'null' && renderCard('Calling Role:', getCallingRole())}
            {getCallCenter() !== 'null' && renderCard('Call Center:', getCallCenter())}
            {renderCardWithArray('Permissions:', getPermissions(), (permission) => (
                `${permission.action} - ${permission.permission_name}`
            ))}
            {renderCardWithArray('Allotted Pradesh:', allottedCountryStates, (location) => (
                `${location.name}(${location.id})`
            ))}
            {renderCardWithArray('Allotted Zilas:', allottedZilas, (location) => (
                `${location.name}(${location.id})`
            ))}
            {renderCardWithArray('Allotted Mandals:', allottedMandals, (location) => (
                `${location.name}(${location.id})`
            ))}
        </div>
    );
};

const renderCard = (label, value) => (
    <span key={label}>
    <div className="card">
      <b>{label}</b> {value}
    </div>
  </span>
);

const renderCardWithArray = (label, array, renderItem) => (
    <span key={label}>
    <div className="card">
      <b>{label}</b>
        {array.map((item, i) => (
            <span key={i}>{(i === 0 ? '' : ', ') + renderItem(item)}</span>
        ))}
    </div>
  </span>
);

export default UserDetails;
