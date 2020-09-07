import React, { useState } from 'react';
import { db } from '../../firebase/config';
import firebase from 'firebase/app';
import './InviteModal.css';

interface InviteModalProps {
  boardId: string;
  memberIds: string[];
  onClose: () => void;
}

function InviteModal({ boardId, memberIds, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Look up user by email
      const usersSnap = await db
        .collection('users')
        .where('email', '==', email.trim().toLowerCase())
        .limit(1)
        .get();

      if (usersSnap.empty) {
        setError(`No user found with email: ${email}`);
        return;
      }

      const invitedUserId = usersSnap.docs[0].id;

      if (memberIds.includes(invitedUserId)) {
        setError('This user is already a member of this board.');
        return;
      }

      await db.collection('boards').doc(boardId).update({
        memberIds: firebase.firestore.FieldValue.arrayUnion(invitedUserId),
        updatedAt: Date.now(),
      });

      setSuccess(`${email} has been added to the board.`);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Invite Members</h3>
        <p className="invite-subtitle">
          Invite people to collaborate on this board.
        </p>
        {error && <div className="invite-error">{error}</div>}
        {success && <div className="invite-success">{success}</div>}
        <form onSubmit={handleInvite} className="invite-form">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
            autoFocus
          />
          <button type="submit" className="btn-primary btn-sm" disabled={loading}>
            {loading ? 'Inviting...' : 'Invite'}
          </button>
        </form>
        <div className="modal-footer">
          <button className="btn-text" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteModal;
