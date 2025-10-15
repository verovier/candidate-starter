<script>
    export let prompt;

    export let onEdit = (id) => {};
    export let onDelete = (id) => {};

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
</script>

<div class="prompt-card">
    <div class="prompt-header">
        <h3>{prompt.name}</h3>
        <div class="actions">
            <button class="edit" on:click={() => onEdit(prompt.id)}>Edit</button>
            <button class="delete" on:click={() => onDelete(prompt.id)}>Delete</button>
        </div>
    </div>
    <p class="prompt-text">{prompt.text}</p>
    <small class="updated">Updated: {formatDate(prompt.updatedAt)}</small>
</div>

<style>
    .prompt-card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        background: #fafafa;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: transform 0.1s;
    }

    .prompt-card:hover {
        transform: translateY(-2px);
    }

    .prompt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .actions button {
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
    }

    .actions .edit {
        background: #3b82f6;
    }

    .actions .delete {
        background: #ef4444;
    }

    .prompt-text {
        margin: 0.5rem 0;
        color: #333;
    }

    .updated {
        font-size: 0.8rem;
        color: #777;
    }
</style>
