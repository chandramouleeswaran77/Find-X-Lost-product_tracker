package com.example.findX.backend.service;

import com.example.findX.backend.model.LostItem;
import com.example.findX.backend.model.FoundItem;
import com.example.findX.backend.repository.LostItemRepository;
import com.example.findX.backend.repository.FoundItemRepository;
import com.example.findX.backend.repository.UserRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private FoundItemRepository foundItemRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get overall statistics
     */
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalLostItems = lostItemRepository.count();
        long totalFoundItems = foundItemRepository.count();
        long openLostItems = lostItemRepository.findByResolvedFalse().size();
        long openFoundItems = foundItemRepository.findByClaimedFalse().size();
        long totalUsers = userRepository.count();
        
        // Count matches
        long matches = lostItemRepository.findAll().stream()
            .filter(item -> "POSSIBLE_MATCH".equals(item.getStatus()))
            .count();
        
        stats.put("totalLostItems", totalLostItems);
        stats.put("totalFoundItems", totalFoundItems);
        stats.put("openLostItems", openLostItems);
        stats.put("openFoundItems", openFoundItems);
        stats.put("totalUsers", totalUsers);
        stats.put("totalMatches", matches);
        stats.put("resolvedItems", totalLostItems - openLostItems);
        
        return stats;
    }

    /**
     * Get monthly statistics
     */
    public Map<String, Object> getMonthlyStatistics(int year, int month) {
        Map<String, Object> stats = new HashMap<>();
        
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        
        List<LostItem> lostItems = lostItemRepository.findAll().stream()
            .filter(item -> item.getCreatedAt() != null && 
                   !item.getCreatedAt().isBefore(startDate) && 
                   !item.getCreatedAt().isAfter(endDate))
            .collect(Collectors.toList());
            
        List<FoundItem> foundItems = foundItemRepository.findAll().stream()
            .filter(item -> item.getCreatedAt() != null && 
                   !item.getCreatedAt().isBefore(startDate) && 
                   !item.getCreatedAt().isAfter(endDate))
            .collect(Collectors.toList());
        
        long monthlyMatches = lostItems.stream()
            .filter(item -> "POSSIBLE_MATCH".equals(item.getStatus()))
            .count();
        
        stats.put("month", month);
        stats.put("year", year);
        stats.put("lostItems", lostItems.size());
        stats.put("foundItems", foundItems.size());
        stats.put("matches", monthlyMatches);
        stats.put("lostItemsList", lostItems);
        stats.put("foundItemsList", foundItems);
        
        return stats;
    }

    /**
     * Generate monthly PDF report
     */
    public byte[] generateMonthlyPDFReport(int year, int month) throws Exception {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.DARK_GRAY);
        Paragraph title = new Paragraph("FindX Monthly Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(10);
        document.add(title);
        
        // Date
        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.GRAY);
        Paragraph date = new Paragraph(
            String.format("Period: %s %d", 
                YearMonth.of(year, month).getMonth().toString(), year), 
            dateFont);
        date.setAlignment(Element.ALIGN_CENTER);
        date.setSpacingAfter(20);
        document.add(date);
        
        // Get statistics
        Map<String, Object> monthlyStats = getMonthlyStatistics(year, month);
        
        // Summary Section
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK);
        Paragraph summaryTitle = new Paragraph("Summary", sectionFont);
        summaryTitle.setSpacingBefore(10);
        summaryTitle.setSpacingAfter(10);
        document.add(summaryTitle);
        
        // Statistics Table
        PdfPTable statsTable = new PdfPTable(2);
        statsTable.setWidthPercentage(100);
        statsTable.setSpacingBefore(10);
        statsTable.setSpacingAfter(20);
        
        addTableCell(statsTable, "Total Lost Items Reported", String.valueOf(monthlyStats.get("lostItems")));
        addTableCell(statsTable, "Total Found Items Reported", String.valueOf(monthlyStats.get("foundItems")));
        addTableCell(statsTable, "Successful Matches", String.valueOf(monthlyStats.get("matches")));
        addTableCell(statsTable, "Total Items", 
            String.valueOf((int)monthlyStats.get("lostItems") + (int)monthlyStats.get("foundItems")));
        
        document.add(statsTable);
        
        // Lost Items Section
        @SuppressWarnings("unchecked")
        List<LostItem> lostItems = (List<LostItem>) monthlyStats.get("lostItemsList");
        if (!lostItems.isEmpty()) {
            Paragraph lostTitle = new Paragraph("Lost Items", sectionFont);
            lostTitle.setSpacingBefore(20);
            lostTitle.setSpacingAfter(10);
            document.add(lostTitle);
            
            PdfPTable lostTable = new PdfPTable(4);
            lostTable.setWidthPercentage(100);
            lostTable.setWidths(new float[]{3, 2, 2, 2});
            
            // Headers
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            PdfPCell header;
            
            header = new PdfPCell(new Phrase("Item", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            lostTable.addCell(header);
            
            header = new PdfPCell(new Phrase("Location", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            lostTable.addCell(header);
            
            header = new PdfPCell(new Phrase("Status", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            lostTable.addCell(header);
            
            header = new PdfPCell(new Phrase("Date", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            lostTable.addCell(header);
            
            // Data
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            for (LostItem item : lostItems) {
                lostTable.addCell(new Phrase(item.getItem(), dataFont));
                lostTable.addCell(new Phrase(item.getLocation() != null ? item.getLocation() : "N/A", dataFont));
                lostTable.addCell(new Phrase(item.getStatus() != null ? item.getStatus() : "OPEN", dataFont));
                lostTable.addCell(new Phrase(item.getDate() != null ? item.getDate() : "N/A", dataFont));
            }
            
            document.add(lostTable);
        }
        
        // Found Items Section
        @SuppressWarnings("unchecked")
        List<FoundItem> foundItems = (List<FoundItem>) monthlyStats.get("foundItemsList");
        if (!foundItems.isEmpty()) {
            Paragraph foundTitle = new Paragraph("Found Items", sectionFont);
            foundTitle.setSpacingBefore(20);
            foundTitle.setSpacingAfter(10);
            document.add(foundTitle);
            
            PdfPTable foundTable = new PdfPTable(4);
            foundTable.setWidthPercentage(100);
            foundTable.setWidths(new float[]{3, 2, 2, 2});
            
            // Headers
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            PdfPCell header;
            
            header = new PdfPCell(new Phrase("Item", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            foundTable.addCell(header);
            
            header = new PdfPCell(new Phrase("Location", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            foundTable.addCell(header);
            
            header = new PdfPCell(new Phrase("Status", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            foundTable.addCell(header);
            
            header = new PdfPCell(new Phrase("Date", headerFont));
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            foundTable.addCell(header);
            
            // Data
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            for (FoundItem item : foundItems) {
                foundTable.addCell(new Phrase(item.getItem(), dataFont));
                foundTable.addCell(new Phrase(item.getLocation() != null ? item.getLocation() : "N/A", dataFont));
                foundTable.addCell(new Phrase(item.getStatus() != null ? item.getStatus() : "OPEN", dataFont));
                foundTable.addCell(new Phrase(item.getDate() != null ? item.getDate() : "N/A", dataFont));
            }
            
            document.add(foundTable);
        }
        
        // Footer
        Paragraph footer = new Paragraph("\n\nGenerated by FindX - Lost & Found Management System", 
            FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);
        
        document.close();
        
        return baos.toByteArray();
    }

    private void addTableCell(PdfPTable table, String label, String value) {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
        
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPaddingBottom(5);
        table.addCell(labelCell);
        
        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPaddingBottom(5);
        table.addCell(valueCell);
    }

    /**
     * Get user activity
     */
    public Map<String, Object> getUserActivity() {
        Map<String, Object> activity = new HashMap<>();
        
        List<LostItem> recentLost = lostItemRepository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(10)
            .collect(Collectors.toList());
            
        List<FoundItem> recentFound = foundItemRepository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(10)
            .collect(Collectors.toList());
        
        activity.put("recentLostItems", recentLost);
        activity.put("recentFoundItems", recentFound);
        
        return activity;
    }
}

