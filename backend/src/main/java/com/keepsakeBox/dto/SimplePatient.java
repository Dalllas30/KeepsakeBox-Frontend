/**
 * @author Bruna Vieites - fc55792
 */

package com.keepsakeBox.dto;

public class SimplePatient {
    private String id;
    private String name;
    private String displayName;
    private String profileImageURL;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getProfileImageURL() {
        return profileImageURL;
    }

    public void setProfileImageURL(String profileImageURL) {
        this.profileImageURL = profileImageURL;
    }

    @Override
    public String toString() {
        return "SimplePatient{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", displayName='" + displayName + '\'' +
                ", profileImageURL='" + profileImageURL + '\'' +
                '}';
    }
}
