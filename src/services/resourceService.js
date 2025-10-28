import supabase from "./supabase";

export async function fetchDocuments() {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching Documents:", error);
        return [];
    }

    return data;
}

export async function fetchDocumentById(id) {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching Document by ID:", error);
        return null;
    }

    return data;
}

export async function deleteDocument(id) {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Error deleting Document:", error);
        return false;
    }

    return true;
}

export async function updateDocument(id, updates) {
    const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error updating Document:", error);
        return null;
    }

    return data;
}