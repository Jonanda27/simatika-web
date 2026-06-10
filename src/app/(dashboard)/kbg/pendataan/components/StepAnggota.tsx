"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";
import { MemberModal } from "./MemberModal";
import { FamilyFormData, FamilyMember } from "@/types/family";

interface Props {
  data: FamilyFormData;
  updateField: (key: keyof FamilyFormData, value: any) => void;
}

export function StepAnggota({ data, updateField }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const members = data.members || [];

  const handleOpenModal = (index: number | null = null) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleSaveMember = (memberData: any) => {
    const newMembers = [...members];
    if (editingIndex !== null) {
      newMembers[editingIndex] = memberData as FamilyMember;
    } else {
      newMembers.push(memberData as FamilyMember);
    }
    updateField("members", newMembers);
    handleCloseModal();
  };

  const handleDeleteMember = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      updateField("members", newMembers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Anggota Keluarga</h2>
          <p className="text-slate-500 mt-1">Total {members.length} Orang Terdata</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-brown-100 to-brown-200 rounded-md text-brown-700 shadow-sm border border-brown-200/50">
          <Users className="h-7 w-7" />
        </div>
      </div>

      {members.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200/80 rounded-md p-16 flex flex-col items-center justify-center bg-slate-50/50 text-center">
          <div className="p-5 bg-white shadow-sm border border-slate-100 rounded-full mb-6">
            <Users className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg text-slate-700 font-bold mb-2">Belum Ada Data Anggota</h3>
          <p className="text-slate-500 mb-8 max-w-sm">
            Silakan tambahkan anggota keluarga pertama untuk melengkapi sensus pendataan ini.
          </p>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-brown-600 hover:bg-brown-700 text-white rounded-full px-8 py-6 shadow-md shadow-brown-900/20 text-md font-semibold transition-transform active:scale-95"
          >
            <UserPlus className="h-5 w-5 mr-3" />
            Tambah Anggota
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {members.map((member: FamilyMember, index: number) => (
            <div
              key={index}
              className="bg-white border border-slate-200/80 rounded-md p-5 flex items-center justify-between hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 bg-brown-50 rounded-xl text-brown-600 group-hover:bg-brown-100 transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{member.nama_lengkap || "Tanpa Nama"}</h4>
                  <p className="text-slate-500 font-medium">{member.status_keluarga || "Anggota"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-orange-600 hover:text-white hover:bg-orange-500 border-orange-200 transition-colors"
                  onClick={() => handleOpenModal(index)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-white hover:bg-red-500 border-red-200 transition-colors"
                  onClick={() => handleDeleteMember(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            onClick={() => handleOpenModal()}
            variant="outline"
            className="w-full mt-6 border-brown-300 border-dashed text-brown-700 hover:bg-brown-50 h-16 rounded-md text-md font-semibold bg-transparent"
          >
            <UserPlus className="h-5 w-5 mr-3" />
            Tambah Anggota Baru
          </Button>
        </div>
      )}

      {isModalOpen && (
        <MemberModal
          initialData={editingIndex !== null ? members[editingIndex] : null}
          onClose={handleCloseModal}
          onSave={handleSaveMember}
        />
      )}
    </div>
  );
}
