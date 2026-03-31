package com.keepsakeBox.dto;
import java.util.List;

public class RtSessionCreateDataList {

	//Definition
	private List<RtSessionCreateData> rtSessionCreateDataList;

	public List<RtSessionCreateData> getRtSessionCreateData() {
		return rtSessionCreateDataList;
	}

	public void setRtSessionCreateData(List<RtSessionCreateData> rtSessionCreateDataList) {
		this.rtSessionCreateDataList = rtSessionCreateDataList;
	}

	public void addRtSessionCreateData(List<RtSessionCreateData> rtSessionCreateDataList) {
		if (this.rtSessionCreateDataList == null) {
			this.rtSessionCreateDataList = rtSessionCreateDataList;
		} else {
			this.rtSessionCreateDataList.addAll(rtSessionCreateDataList);
		}
	}

	public boolean containsId(String id) {
		
		if (rtSessionCreateDataList == null)
			return false; 

	    for (final RtSessionCreateData rtscd : rtSessionCreateDataList) {
	        if (rtscd.getId().equals(id)) {
	            return true;
	        }
	    }
	    return false;
	}

	//For logging proposes
	@Override
	public String toString() {
		return String.format(
				"RtSessionCreateData [rtSessionCreateDataList=%s]", 
				rtSessionCreateDataList);
	}

}
