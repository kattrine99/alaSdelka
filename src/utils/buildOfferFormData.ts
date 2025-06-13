import { OfferPayload } from "../Store/api/types";

export const buildOfferFormData = (data: OfferPayload): FormData => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("listing_type", data.listing_type);
    formData.append("offer_type", data.offer_type);
    formData.append("category_id", String(data.category_id));
    formData.append("price", String(data.price));
    formData.append("user_name", data.user_name);
    formData.append("user_phone", data.user_phone);
    formData.append("area", String(data.area));
    formData.append("address[address]", data.address?.address || "Не указан");
    formData.append("address[latitude]", "0");
    formData.append("address[longitude]", "0");
    formData.append("address[city_id]", String(data.address?.city_id || ""));
    formData.append("premises_ownership_form", data.premises_ownership_form || "");
    formData.append("business_type", data.business_type || "");

    data.conveniences?.forEach((id, index) => {
        formData.append(`conveniences[${index}]`, String(id));
    });

    if (data.listing_type === "sell") {
        formData.append("average_monthly_revenue", String(data.average_monthly_revenue || 0));
        formData.append("average_monthly_profit", String(data.average_monthly_profit || 0));
        formData.append("average_monthly_expenses", String(data.average_monthly_expenses || 0));
        formData.append("payback_period", String(data.payback_period || 0));
        formData.append("percentage_for_sale", String(data.percentage_for_sale || 0));
        formData.append("foundation_year", String(data.foundation_year || 0));

        existingDocuments.forEach((doc, idx) => {
            formData.append(`existing_documents[${idx}]`, doc.id.toString());
        });

        newDocuments.forEach((file, idx) => {
            formData.append(`documents[${idx}]`, file);
        });
        data.photos?.forEach((item, idx) => {
            formData.append(`photos[${idx}][photo]`, item.photo);
            formData.append(`photos[${idx}][order]`, String(item.order));
        });

        data.communication_channels?.forEach((ch, idx) => {
            formData.append(`communication_channels[${idx}][channel_name]`, ch.channel_name);
            formData.append(`communication_channels[${idx}][link]`, ch.link);
        });
    }

    if (data.project_stage_id) {
        formData.append("project_stage_id", String(data.project_stage_id));
    }

    return formData;
};
