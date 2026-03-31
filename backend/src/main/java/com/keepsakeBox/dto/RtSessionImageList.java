package com.keepsakeBox.dto;

import java.util.List;

public class RtSessionImageList {
    private List<RtSessionImage> images;

    public List<RtSessionImage> getImages() {
        return images;
    }

    public void setImages(List<RtSessionImage> images) {
        this.images = images;
    }

    @Override
    public String toString() {
        return String.format(
                "RtSessionImageList [images=%s]",
                images);
    }

}
